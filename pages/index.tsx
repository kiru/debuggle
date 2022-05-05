import type {NextPage} from 'next'
import Head from 'next/head'
import {FormEventHandler, useEffect, useState} from "react";
import {solution} from "../components/puzzle";
import jsTokens, {Token} from "js-tokens";
import dynamic from "next/dynamic";
import classNames from "classnames";
import {string} from "prop-types";
import {toast, Toaster} from 'react-hot-toast';

const solutionTokens = Array.from(jsTokens(solution.code))
const stringToCount = calculateOccurence()

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


function useStickyState<T>(defaultValue: T, key: string) {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);

    // @ts-ignore
    return stickyValue !== null
      ? JSON.parse(stickyValue)
      : defaultValue;
  });

  useEffect(() => {
    // @ts-ignore
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

const Home = dynamic(
  () => Promise.resolve(HomeInternal),
  {ssr: false}
);


const HomeInternal: NextPage = () => {
  const [redactedCode, setRedactedCode] = useState<string>("")

  const [currentWord, setCurrentWord] = useState<string>("")
  const [guessedWords, setGuessedWords] = useStickyState<string[]>([], `guessedWordList${solution.id}`)


  const isGuessed = (word: string) => {
    return guessedWords.indexOf(word.toLowerCase(), 0) != -1
  }

  const redactPartially = (word: string) => {
    return word.replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(" ")
      .map(each => {
        if (isGuessed(each)) {
          return each
        } else {
          return "█".repeat(each.length)
        }
      })
      .join("")
  }

  const isSolved = redactPartially(solution.filename) == solution.filename
  const [solvedOnce, setSolvedOnce] = useState<boolean>(isSolved)

  useEffect(() => {
    console.log("Hi there. Are you looking for the solution in the code? " +
      "It is easier than you think. If you see this message, ping me on twitter @kiru_io");
  }, [])

  useEffect(() => {
    setRedactedCode(solutionTokens.map(token => {
      // in case of comment, the '//' is only given as a line
      if (token.type == "SingleLineComment") {
        return token.value.split(" ")
          .map(singleWord => {
            return isGuessed(singleWord) ? singleWord : redactPartially(singleWord);
          }).join(" ");

      } else {
        // if word is guessed, reveal
        if (isGuessed(token.value)) {
          return token.value;
        } else {
          // otherwise print the line-space
          if (token.type == "WhiteSpace" || token.type == "LineTerminatorSequence") {
            return token.value;
          }
          // or replace by placeholder
          return redactPartially(token.value)
        }
      }
    }).join(""))


    if(!solvedOnce && redactPartially(solution.filename) == solution.filename){
      toast.success("Good job!", {id: "solved", duration: 2000})
      setSolvedOnce(true)
    }
  }, [guessedWords])

  let onSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    setGuessedWords((prev: string[]) => {
      // add to the list in case it's not there yet
      if (!isGuessed(currentWord)) {
        return [...prev, currentWord.toLowerCase()];
      } else {
        return prev;
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
    for (const each of guessedWords) {
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

        <meta name="description"
              content="Find a known redacted algorithm word by word. Every day a new algorithm"/>

        <meta property="og:url" content="https://debuggle.net/"/>
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content="Debuggle"/>
        <meta property="og:description"
              content="Find a known redacted algorithm word by word. Every day a new algorithm"/>
        <meta property="og:title" content="Find a known redacted algorithm word by word. Every day a new algorithm"/>
        {/*<meta property="og:image" content="https://learnle.net/TwitterCard.png"/>*/}
      </Head>

      <main>

        <div className="flex flex-col min-h-screen sm:flex-row">
          <div className="border-r border-r-gray-300">
            <div className="p-2 pl-4 text-sm w-full bg-gray-700 w-full uppercase">
              Debuggle
            </div>
            <div className="w-full bg-gray-600 h-1.5"></div>

            <div className="p-4">
              <form action="" onSubmit={onSubmit}>
                <input name={"text"} className="rounded p-2 text-black focus:outline-slate-400 rounded-sm"
                       onChange={e => setCurrentWord(e.target.value)}
                       value={currentWord}/>
              </form>

              <div className="mt-4 gap-1 flex flex-col ">
                {guessedWords?.map((each: string) => {
                  return <div key={each} className="px-1 flex hover:bg-gray-700 ">
                    <div className="flex-grow">{each}</div>
                    <div>{
                      !stringToCount.has(each.toLowerCase()) ?  0 : stringToCount.get(each.toLowerCase())
                    }</div>
                  </div>
                })}
              </div>
            </div>

          </div>
          <div className="font-mono w-full">
            <div className={classNames(
              "p-2 text-sm w-full italic w-full",
              {'bg-green-800': isSolved, 'bg-gray-700': !isSolved}
            )}>
              {redactPartially(solution.filename)}<span>.{solution.extension}</span>
            </div>
            <div>
              <div className="w-full bg-gray-200 h-1.5">
                <div className="bg-gray-600 h-1.5 transition-all duration-300" style={{width: getPercentage()}}/>
              </div>

              <div className="p-2 text-left">
                <pre className="tracking-tight">
                  {!solvedOnce && redactedCode}
                  {solvedOnce && solution.code}
                </pre>
              </div>
            </div>
          </div>
        </div>
        <div><Toaster/></div>
      </main>

      <a target="_blank" href="https://kiru.io/"
         className="kiru items-center rounded-tl-lg hover:bg-gray-700 hover:text-white bg-blue-700 align-middle ">
        <img src="https://wordleart.kiru.io/mini-kiru.jpg" alt="Kiru Logo" className="rounded-full h-6 "/><p
        className="m-1">by Kiru.io</p></a>
    </div>
  )
}

export default Home
