import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import {FormEventHandler, useEffect, useState} from "react";
import {solution} from "../components/puzzle";
import jsTokens from "js-tokens";


// const solution = {
//   id: "32j3",
//   originalText: " It's not only writers who can benefit from this free online tool. If you're a programmer who's working on a project where blocks of text are needed, this tool can be a great way to get that. It's a good way to test your programming and that the tool being created is working well.\n" +
//     "\n" +
//     "Above are a few examples of how the random paragraph generator can be beneficial. The best way to see if this random paragraph picker will be useful for your intended purposes is to give it a try. Generate a number of paragraphs to see if they are beneficial to your current project.\n" +
//     "\n" +
//     "If you do find this paragraph tool useful, please do us a favor and let us know how you're using it. It's greatly beneficial for us to know the different ways this tool is being used so we can improve it with updates. This is especially true since there are times when the generators we create get used in completely unanticipated ways from when we initially created them. If you have the time, please send us a quick note on wha",
//   redactedWords: [
//     "paragraph",
//     "writers",
//     "this",
//     "best",
//     "being",
//     "created",
//     "them",
//   ]
// }
// const SharePage = () => {
//   const [textToShow, setTextToShow] = useState<string>()
//
//   const [currentWord, setCurrentWord] = useState<string>("")
//   const [guessedWords, setGuessedWords] = useState<string[]>([])
//   const [redactedWords, setRedactedWords] = useState<string[]>(solution.redactedWords)
//   const [wordToCount, setWordToCount] = useState<Map<string, number>>()
//
//   useEffect(() => {
//     const text: string[] = solution.originalText.split(" ");
//     for (const s of redactedWords) {
//       for (let i = 0; i < text.length; i++) {
//         if (text[i].toUpperCase() == s.toUpperCase()) {
//           text[i] = text[i].replaceAll(RegExp(".", "g"), "█")
//         }
//       }
//     }
//
//     // @ts-ignore
//     const myTokenizer = tokenizer();
//     let message: Tokenizer.Token[] = myTokenizer.tokenize(solution.originalText);
//     let wordToCount = new Map<string, number>()
//     message.forEach(each => {
//       if (wordToCount.has(each.value)) {
//         wordToCount.set(each.value, wordToCount.get(each.value)! + 1)
//       } else {
//         wordToCount.set(each.value, 1)
//       }
//     })
//
//     // most common words
//     setWordToCount(wordToCount)
//
//     // let's begin the initial message
//     setTextToShow(text.join(" "))
//   }, [redactedWords, textToShow, wordToCount])
//
//
//   let onSubmit: FormEventHandler = (e) => {
//     e.preventDefault();
//     console.log("submit");
//
//     setGuessedWords((prev) => {
//       return [...prev, currentWord];
//     })
//
//
//     if (redactedWords.indexOf(currentWord, 0) != -1) {
//       console.log("ja");
//       setRedactedWords(prev => {
//         return prev.filter(each => each != currentWord)
//       })
//     }
//     setCurrentWord("")
//   };
//
//   return (
//     <>
//       <Head>
//         <title>Classroomle - Trendy teaching</title>
//         <link rel="icon" href="/favicon.ico"/>
//       </Head>
//
//       <div className="flex flex-row">
//         <div className="border-r border-r-blue-300 p-4 h-screen">
//           <form action="" onSubmit={onSubmit}>
//             <input name={"text"} className="border p-2" onChange={e => setCurrentWord(e.target.value)}
//                    value={currentWord}/>
//           </form>
//
//           <div className="mt-4 gap-1 flex flex-col">
//             {guessedWords?.map(each => {
//               return <div key={each}>
//                 {each}
//               </div>
//             })}
//           </div>
//
//           <div>
//             {Array(wordToCount?.values()).map(each => {
//               return <div>
//                 {each[0]}
//               </div>
//             })}
//           </div>
//
//         </div>
//         <div className="p-4 max-w-lg font-mono">
//
//           <div className="text-sm w-full border-b border-b-300">add progress bar here 0/10</div>
//
//           {textToShow?.split("\n").map((each, i) => {
//             return <div key={i} className="p-1">{each}</div>
//           })}
//         </div>
//       </div>
//     </>
//   )
// }


const Home: NextPage = () => {


  const [redactedCode, setRedactedCode] = useState<string>("")

  const [currentWord, setCurrentWord] = useState<string>("")
  const [guessedWords, setGuessedWords] = useState<string[]>([])

  const isGuessed = (word: string) => {
    return guessedWords.indexOf(word, 0) != -1
  }

  useEffect(() => {

    const abc = jsTokens(solution.code);
    const tokens = Array.from(abc)
    setRedactedCode(tokens.map(each => {

      if (each.type == "SingleLineComment") {

        return each.value.split(" ").map(comWord => {
          if(isGuessed(comWord)){
            return comWord;
          }else{
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

    setGuessedWords((prev) => {
      return [...prev, currentWord];
    })

    setCurrentWord("")
  };
  const b = "quicksort"
  const a = b.replace(RegExp(".", "g"), "█")

  return (
    <div className="bg-[#252526] text-white">
      <Head>
        <title>Debuggle</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main>

        <div className="flex flex-row min-h-screen">
          <div className="border-r border-r-gray-300 p-4 ">
            <form action="" onSubmit={onSubmit}>
              <input name={"text"} className="rounded p-2 text-black" onChange={e => setCurrentWord(e.target.value)}
                     value={currentWord}/>
            </form>

            <div className="mt-4 gap-1 flex flex-col">
              {guessedWords?.map(each => {
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
