import type {NextPage} from 'next'
import Head from 'next/head'
import {FormEventHandler, useEffect, useState} from "react";
import {solution} from "../components/puzzle";
import jsTokens from "js-tokens";
import dynamic from "next/dynamic";


const solutionTokens = Array.from(jsTokens(solution.code))

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
  return (
    <div className="bg-[#252526] text-white">
      <Head>
        <title>Debugle</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main>

        <div className="flex flex-row min-h-screen">

          <div className="border-r border-r-gray-300">
            <div className="p-2 text-sm w-full bg-gray-500 italic w-full">
              Debuggle
            </div>

            <div className="p-4">
              <form action="" onSubmit={onSubmit}>
                <input name={"text"} className="rounded p-2 text-black" onChange={e => setCurrentWord(e.target.value)}
                       value={currentWord}/>
              </form>

              <div className="mt-4 gap-1 flex flex-col">
                {guessedWords?.map((each: string) => {
                  return <div key={each}>
                    {each}
                  </div>
                })}
              </div>
            </div>

          </div>
          <div className="font-mono w-full">

            <div className="p-2 text-sm w-full bg-gray-500 italic w-full">
              {redactPartially(solution.filename)}<span>.{solution.extension}</span>
            </div>
            <div>
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
