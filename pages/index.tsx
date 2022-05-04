import type {NextPage} from 'next'
import Head from 'next/head'
import {FormEventHandler, useEffect, useState} from "react";
import {solution} from "../components/puzzle";
import jsTokens from "js-tokens";
import dynamic from "next/dynamic";
import Script from 'next/script';

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

  useEffect(() => {
    console.log("Hi there. Are you looking for the solution in the code? It is easier than you think. If you see this message, ping me on twitter @kiru_io");
  }, [])

  useEffect(() => {

    const abc = jsTokens(solution.code);
    const tokens = Array.from(abc)
    setRedactedCode(tokens.map(each => {

      if (each.type == "SingleLineComment") {

        return each.value.split(" ").map(comWord => {
          if (isGuessed(comWord)) {
            return comWord;
          } else {
            return "█".repeat(comWord.length)
          }
        }).join(" ");

      } else {
        if (isGuessed(each.value)) {
          return each.value;
        } else {
          if (each.type == "WhiteSpace" || each.type == "LineTerminatorSequence") {
            return each.value;
          }
          return "█".repeat(each.value.length)
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
  const b = "quicksort"
  const a = b.replace(RegExp(".", "g"), "█")

  return (
    <div className="bg-[#252526] text-white">
      <Head>
        <title>Debugle</title>
        <link rel="icon" href="/favicon.ico"/>
        <Script defer data-domain="debugle.net" src="https://plausible.io/js/plausible.js"/>

      </Head>

      <main>

        <div className="flex flex-row min-h-screen">
          <div className="border-r border-r-gray-300 p-4 ">
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
          <div className="font-mono w-full">

            <div className="p-2 text-sm w-full bg-gray-500 italic w-full">
              {a}<span>.js</span>
            </div>
            <div>
              <div className="p-2 text-left">
                <pre>{redactedCode}</pre>
              </div>
            </div>
          </div>
        </div>


      </main>
    </div>
  )
}

export default Home
