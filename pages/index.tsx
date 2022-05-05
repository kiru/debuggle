import type {NextPage} from 'next'
import Head from 'next/head'
import {FormEventHandler, useEffect, useState} from "react";
import {solution} from "../components/puzzle";
import jsTokens, {Token} from "js-tokens";
import dynamic from "next/dynamic";

function bla() {
  const solutionTokens = Array.from(jsTokens(solution.code))
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
          inc(singleWord)
          singleWord.replace(/([a-z])([A-Z])/g, '$1 $2')
            .split(" ")
            .forEach(o => inc(o))
        });
    } else {
      if (!(token.type == "WhiteSpace" || token.type == "LineTerminatorSequence")) {
        inc(token.value)
        token.value.replace(/([a-z])([A-Z])/g, '$1 $2')
          .split(" ")
          .forEach(o => inc(o))
      }
    }
  })
  return stringToCount;
}

const solutionTokens = Array.from(jsTokens(solution.code))
const stringToCount = bla()

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

  useEffect(() => {
    console.log("Hi there. Are you looking for the solution in the code? It is easier than you think. If you see this message, ping me on twitter @kiru_io");
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
  }, [guessedWords])

  let onSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    setGuessedWords((prev: string[]) => {
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

    Array.from(stringToCount.keys()).forEach(each => {
      length += stringToCount.get(each)!
    })

    for(const each of guessedWords){
      if(stringToCount.has(each)){
        guessed += stringToCount.get(each)!
      }
    }

    return `${Math.floor(guessed/length*100)}%`
  }

  return (
    <div className="bg-[#252526] text-white">
      <Head>
        <title>Debuggle :: Find a known algorithm</title>
        <link rel="icon" href="/favicon.ico"/>


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

        <div className="flex flex-row min-h-screen">

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

              <div className="mt-4 gap-1 flex flex-col">
                {guessedWords?.map((each: string) => {
                  return <div key={each} className="px-1 flex hover:bg-gray-700 ">
                    <div className="flex-grow">{each}</div>
                    <div>{stringToCount.get(each.toLowerCase())}</div>
                  </div>
                })}
              </div>
            </div>

          </div>
          <div className="font-mono w-full">
            <div className="p-2 text-sm w-full bg-gray-700 italic w-full">
              {redactPartially(solution.filename)}<span>.{solution.extension}</span>

            </div>
            <div>
              <div className="w-full bg-gray-200 h-1.5">
                <div className="bg-gray-600 h-1.5" style={{width: getPercentage()}}></div>
              </div>

              <div className="p-2 text-left">
                <pre className="tracking-tight">{redactedCode}</pre>
              </div>
            </div>
          </div>
        </div>


      </main>
    </div>
  )
}

export default Home
