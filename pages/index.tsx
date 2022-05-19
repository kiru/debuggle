import type {NextPage} from 'next'
import Head from 'next/head'
import {FormEventHandler, useEffect, useState} from "react";
import {solution} from "../components/puzzle";
import jsTokens from "js-tokens";
import dynamic from "next/dynamic";
import classNames from "classnames";
import {toast, Toaster} from 'react-hot-toast';
import {PopupManager, PopupToShow} from "../components/Dialogs";
import {GameState, GameStats, Settings} from "../lib/types";
import {debug, useStickyState} from "../lib/commons";
import {CogIcon, InformationCircleIcon} from "@heroicons/react/solid";

const solutionTokens = Array.from(jsTokens(solution.code))
const stringToCount = calculateOccurence()


const isGuessed = (word: string, gameState: GameState) => {
  return gameState.guessedWords.indexOf(word.toLowerCase(), 0) != -1
}


const redactPartially = (word: string, gameState: GameState) => {
  return word.replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(" ")
    .map(each => {
      if (isGuessed(each, gameState)) {
        return each
      } else {
        return "█".repeat(each.length)
      }
    })
    .join("")
}


function calculateOccurence() {
  const stringToCount = new Map<string, number>()

  function inc(w: string) {
    w = w.toLowerCase()
    if (stringToCount.has(w)) {
      stringToCount.set(w, stringToCount.get(w)! + 1)
    } else {
      stringToCount.set(w, 1)
    }
  }

  solutionTokens.forEach(token => {
    if (token.type == "SingleLineComment") {
      return token.value.split(" ")
        .forEach(singleWord => {
          singleWord.replace(/([a-z])([A-Z])/g, '$1 $2')
            .split(" ")
            .forEach(o => inc(o))
        });
    } else {
      if (!(token.type == "WhiteSpace" || token.type == "LineTerminatorSequence")) {
        token.value.replace(/([a-z])([A-Z])/g, '$1 $2')
          .split(" ")
          .forEach(o => inc(o))
      }
    }
  })
  return stringToCount;
}

// For some reason the meta tags were not generated statically
// This ensure that everything is generated statically
const Home = dynamic(
  () => Promise.resolve(HomeInternal),
  {ssr: false}
);


const CodeViewer = (prop: { gameState: GameState }) => {
  const [redactedCode, setRedactedCode] = useState<JSX.Element>(<div/>)
  const [hoveredWord, setHoveredWord] = useState<string>("")

  useEffect(() => {
    setRedactedCode(<div>{solutionTokens.map(token => {
      // in case of comment, the '//' is only given as a line, so split the words inside the comment
      if (token.type == "SingleLineComment") {
        let comment = token.value.split(" ")
          .map(singleWord => {
            return isGuessed(singleWord, prop.gameState) ? singleWord : redactPartially(singleWord, prop.gameState);
          }).join(" ");
        return <span>{comment}</span>;
      } else {
        // if word is guessed, reveal
        if (isGuessed(token.value, prop.gameState)) {
          return <span>{token.value}</span>;
        } else {
          // otherwise print the line-space
          if (token.type == "WhiteSpace") {
            return <span>{Array(token.value.length).fill("").map(each => {
              return <>&nbsp;</>
            })}</span>;
          }

          if (token.type == "LineTerminatorSequence") {
            return <br/>
          }
          // or replace by placeholder
          return <span className={classNames({"text-blue-300": token.value == hoveredWord})}
                       onMouseEnter={() => setHoveredWord(token.value)}
                       onMouseLeave={() => setHoveredWord("")}>{redactPartially(token.value, prop.gameState)}</span>
        }
      }
    })}</div>)
  }, [prop.gameState, hoveredWord])

  return (
    <div className="p-2 text-left overflow-auto">
      {!prop.gameState.gameEnded && redactedCode}
      <pre className="tracking-tight">{prop.gameState.gameEnded && solution.code}</pre>
    </div>
  )
}

const HomeInternal: NextPage = () => {
  const [currentWord, setCurrentWord] = useState<string>("")
  const [popupToShow, setPopupToShow] = useState<PopupToShow>(PopupToShow.NONE);
  const [stats, setStats] = useStickyState<GameStats>({
    currentStreak: 0,
    bestStreak: 0,
    timings: []
  }, "gameStats")

  const defaultGameState: GameState = {
    gameId: solution.id,
    guessedWords: [],
    gameEnded: false,
  };
  const [gameState, setGameState] = useStickyState<GameState>(defaultGameState, "gameStateDebuggle");

  const [settings, setSettings] = useStickyState<Settings>({
    firstExplanation: true,
    hardCore: false,
    hideZero: false
  }, "settings");

  useEffect(() => {
    // show initial popup if needed
    if (settings.firstExplanation) {
      debug("show first time help message")
      setPopupToShow(PopupToShow.HELP);
      setSettings({...settings, firstExplanation: false})
    }
  }, [settings])

  useEffect(() => {
    // game id changed, so we have to reset the current settings
    if (gameState.gameId != solution.id) {
      debug("Puzzle changed!")
      setGameState(defaultGameState)
    }
  }, [gameState])

  useEffect(() => {
    console.log("Hi there. Are you looking for the solution in the code? " +
      "It is easier than you think. If you see this message, ping me on twitter @kiru_io");
  }, [])

  useEffect(() => {

    const gameHasNotEndedYet = !gameState.gameEnded
    if (gameHasNotEndedYet) {
      let isSolved = false
      if (settings.hardCore) {
        // are all the words revealed?
        isSolved = getPercentage() == "100%";
      } else {
        // is filename revealed?
        isSolved = redactPartially(solution.filename, gameState) == solution.filename
      }

      if (isSolved) {
        toast.success("Good job!", {id: "solved", duration: 2000})
        setGameState((prev: GameState) => {
          return {...prev, gameEnded: true}
        })
      }
    }
  }, [gameState])

  let onSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    setGameState((prevState: GameState) => {
      // add the new word to the list in case it's not there yet
      if (!isGuessed(currentWord, gameState)) {
        return {
          ...prevState,
          guessedWords: [...prevState.guessedWords, currentWord.toLowerCase()]
        };
      } else {
        return prevState;
      }
    })
    setCurrentWord("")
  };

  let getPercentage = () => {
    let length = 0
    let guessed = 0;

    // get total count
    Array.from(stringToCount.keys()).forEach(each => {
      length += stringToCount.get(each)!
    })

    // count guessed words
    for (const each of gameState.guessedWords) {
      if (stringToCount.has(each)) {
        guessed += stringToCount.get(each)!
      }
    }

    return `${Math.floor(guessed / length * 100)}%`
  }

  return (
    <div className="bg-[#252526] text-white">
      <Head>
        <title>Debuggle :: Find a known algorithm</title>
        <link rel="icon" href="/favicon.ico"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </Head>

      <main>

        <div className="flex flex-col min-h-screen sm:flex-row dark">
          <div className="border-r border-r-gray-300">
            <div className="p-2 pl-4 text-sm w-full bg-gray-700 w-full uppercase flex">
              <div className="flex-grow">
                Debuggle
              </div>

              <div className="flex flex-row">
                <InformationCircleIcon className='h-5 w-5 mr-2 cursor-pointer dark:stroke-white'
                                       onClick={() => setPopupToShow(PopupToShow.HELP)}/>
                <CogIcon className='h-5 w-5 mr-2 cursor-pointer dark:stroke-white'
                         onClick={() => setPopupToShow(PopupToShow.SETTINGS)}/>
              </div>

            </div>
            <div className="w-full bg-gray-600 h-1.5"/>

            <div className="p-4 ">
              <form action="" onSubmit={onSubmit}>
                <input name={"text"} className="rounded p-2 text-black focus:outline-slate-400 rounded-sm"
                       onChange={e => setCurrentWord(e.target.value)}
                       value={currentWord}/>
              </form>

              <div className="mt-4 gap-1 flex flex-col max-h-36 sm:max-h-full overflow-auto">
                {gameState.guessedWords?.filter((each: string) => {
                  if (settings.hideZero) {
                    return stringToCount.has(each.toLowerCase());
                  }
                  return true;
                }).reverse().map((each: string) => {
                  return <div key={each} className="px-1 flex hover:bg-gray-700 ">
                    <div className="flex-grow">{each}</div>
                    <div>{
                      !stringToCount.has(each.toLowerCase()) ? 0 : stringToCount.get(each.toLowerCase())
                    }</div>
                  </div>
                })}
              </div>
            </div>

          </div>
          <div className="font-mono w-full">
            <div className={classNames(
              "flex justify-between p-2 text-sm w-full italic w-full",
              {'bg-green-800': gameState.gameEnded, 'bg-gray-700': !gameState.gameEnded}
            )}>
              <div>
                {/*Show filename */}
                {redactPartially(solution.filename, gameState)}<span>.{solution.extension}</span>
              </div>

              <div className="bg-white text-black px-2 rounded-lg hover:bg-transparent hover:text-white cursor-pointer">
                <a href="https://github.com/kiru/debuggle" target="_blank">Checkout on GitHub</a>
              </div>
            </div>

            <div>
              <div className="w-full bg-gray-200 h-1.5">
                <div className="bg-gray-600 h-1.5 transition-all duration-300" style={{width: getPercentage()}}/>
              </div>

              <CodeViewer gameState={gameState}/>
            </div>
          </div>
        </div>

        <PopupManager popupToShow={popupToShow} onClose={() => setPopupToShow(PopupToShow.NONE)}
                      settings={settings} setSettings={setSettings} gameState={gameState}/>

        <div><Toaster/></div>
      </main>

      <div className="fixed right-0 bottom-0 flex m-4 gap-1">
        <a href="https://kiru.io/" target="_blank">
          <img src="/mini-kiru.jpg" alt="Kiru Logo"
               className="h-6 bg-green-800 rounded hover:ring-green-800 hover:ring-2"/>
        </a>
        <a href="https://mathlegame.com/" target="_blank">
          <img src="/mathle-icon.png" alt="Mathle-Logo"
               className="h-6 bg-green-800 rounded hover:ring-green-800 hover:ring-2"/>
        </a>
        <a href="https://reversle.net/" target="_blank">
          <img src="/reversle-icon.png" alt="Kiru Logo"
               className="h-6 bg-green-800 rounded hover:ring-green-800 hover:ring-2"/>
        </a>
        <a href="https://learnle.net/" target="_blank">
          <img src="/learnle-icon.png" alt="Kiru Logo"
               className="h-6 bg-green-800 rounded hover:ring-green-800 hover:ring-2"/>
        </a>
      </div>
    </div>
  )
}

export default Home
