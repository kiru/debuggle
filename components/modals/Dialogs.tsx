import {Dialog, Switch, Transition} from '@headlessui/react'
import {GameState, GameStats, Settings} from "../../lib/types";
import {Fragment, useEffect, useState} from "react";
import classNames from "classnames";
import {toast} from "react-hot-toast";
import {StatsModal} from "./StatsModal";
import {debug, sumTogether, toSum} from "../../lib/commons";
import {solution} from "../puzzle";

export enum PopupToShow {
  NONE,
  SETTINGS,
  HELP,
  STATISTICS,

  RESULT,
  CHANGELOG,
}

export const PopupManager = (prop: {
  popupToShow: PopupToShow,
  onClose: () => void, settings: Settings, setSettings: any,
  gameState: GameState,
  stats: GameStats
}) => {

  const [open, setOpen] = useState(true)
  const [openPopup, setOpenPopup] = useState<PopupToShow>(PopupToShow.NONE)

  useEffect(() => {
    setOpenPopup(prop.popupToShow);
    if (prop.popupToShow != PopupToShow.NONE) {
      setOpen(true);
    }
  }, [prop.popupToShow])

  useEffect(() => {
    if (!open) {
      setOpenPopup(PopupToShow.NONE)
      prop.onClose();
    }
  }, [open])

  return <>
    {openPopup == PopupToShow.SETTINGS && <>
      <SettingDialog open={open} setOpen={setOpen} settings={prop.settings} setSettings={prop.setSettings}/>
    </>}
    {openPopup == PopupToShow.HELP && <>
      <ExplanationDialog open={open} setOpen={setOpen} settings={prop.settings}/>
    </>}

    {openPopup == PopupToShow.STATISTICS && <>
      <StatsModal
        isOpen={open}
        handleClose={() => setOpen(false)}
        gameStats={prop.stats}
      />

    </>}


    {openPopup == PopupToShow.RESULT && <>
      <SuccessMessage open={open} setOpen={setOpen}
                      gameState={prop.gameState}/>
    </>}

    {openPopup == PopupToShow.CHANGELOG && <>
      <ChangeLog open={open} setOpen={setOpen}/>
    </>}

  </>
}

let ChangeLog = (props: { open: boolean, setOpen: (value: boolean) => void}) => {
  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={props.setOpen}>
        <div
          className="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white dark:bg-slate-600 dark:text-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md spd:w-full sm:p-6">
              <div className="sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none "
                  onClick={() => props.setOpen(false)}>
                  <span className="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <div>
                <div className="mt-3 text-left sm:mt-5">
                  <h1 className="text-blue-800 text-xl mb-2 dark:text-white border-b">Changelog</h1>

                  <div className="">
                    <h2 className="text-lg text-blue-800 my-1">Version 1.3</h2>
                    <ul className="text-sm gap-1 flex flex-col">
                      <li>✅ ADD: Prevent to use the same word more than once</li>
                    </ul>

                    <h2 className="text-lg text-blue-800 my-1">Version 1.2</h2>
                    <ul className="text-sm gap-1 flex flex-col">
                      <li>✅ BUG: Fixed slow input issue. </li>
                    </ul>

                    <h2 className="text-lg text-blue-800 my-1">Version 1.1</h2>
                    <ul className="text-sm gap-1 flex flex-col">
                      <li>✅ ADD: This version dialog with the latest changes</li>
                      <li>✅ ADD: A feedback form to make it easier to contact me</li>
                      <li>✅ BUG: Double letters were not recognized correctly, if only one letter appeared in the solution.</li>
                      <li>✅ BUG: You could enter more than 5 letters</li>
                    </ul>
                  </div>
                  <div className="border-t mt-4 pt-3 text-sm">
                    You found a bug or have an idea for a feature? Contact me via Twitter or or <a className="text-blue-800 font-bold hover:underline" href="https://docs.google.com/forms/d/e/1FAIpQLSdMGuCgYnvEtph0Xc2iMEK13JWktRkPwyEzfYTDg68Wf6hcEA/viewform?usp=sf_link">this form</a>.

                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 dark:bg-slate-300 dark:text-black text-base font-medium text-white
                  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={() => {
                    props.setOpen(false)
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

let ExplanationDialog = (props: { open: boolean, setOpen: (value: boolean) => void, settings: Settings }) => {
  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={props.setOpen}>
        <div
          className="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0 dark">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className="inline-block align-bottom bg-white dark:bg-slate-600 dark:text-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md spd:w-full sm:p-6">
              <div className="sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none "
                  onClick={() => props.setOpen(false)}>
                  <span className="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <div>
                <div className="mt-3 text-left sm:mt-5">
                  <h1 className="text-blue-800 text-xl pb-2 dark:text-white">How to play?</h1>
                  <div className="text flex flex-col gap-2">
                    <div>
                      Try to reveal the redacted source code.
                    </div>
                    <div>
                      You have unlimited tries. Your goal is to guess the filename.
                      Once you guessed the full filename, the whole code will be revealed.
                    </div>
                    <div>
                      The numbers show you how many times the word appears.
                      A new code-puzzle will be published every day.
                    </div>

                    <div>
                      If you find this too boring, try Senior-Programmer-mode, where you have to reveal the whole code.
                    </div>

                    <div>
                      This page is inspired by <a  target="_blank" href="https://www.redactle.com/" className="hover:text-blue-200">Redactle</a>.

                    </div>

                    <div className="text-red-200">
                      This page is WIP (work in progress).
                    </div>
                  </div>

                  <div className="border-t border-blue-200 mt-3 pt-3">
                    <div className="font-light">
                      <p>
                        Hi, I am Kiru 👋 . If you have any questions visit <a href="https://kiru.io/"
                                                                              className="text-blue-200 font-bold hover:underline"
                                                                              target="_blank">kiru.io</a> or contact me
                        via Twitter <a className="text-blue-200 font-bold hover:underline"
                                       href="https://twitter.com/kiru_io" target="_blank">@kiru_io</a>.
                      </p>
                      <p>
                        Checkout my other projects: <a className="text-blue-200 font-bold hover:underline"
                                                       href="http://reversle.net/"
                                                       target="_blank">Reversle.net</a> and <a
                        className="text-blue-200 font-bold hover:underline" href="https://mathlegame.com"
                        target="_blank">Mathle</a>.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 dark:bg-slate-300 dark:text-black text-base font-medium text-white
                  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={() => {
                    props.setOpen(false)
                  }}
                >
                  Let's try!
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}


// @ts-ignore
function msToTime(duration) {
  let seconds: string | number = Math.floor((duration / 1000) % 60);
  let minutes: string | number = Math.floor((duration / (1000 * 60)) % 60);
  let hours: string | number = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? `0${hours}` : hours;
  minutes = (minutes < 10) ? `0${minutes}` : minutes;
  seconds = (seconds < 10) ? `0${seconds}` : seconds;

  return `${hours}:${minutes}:${seconds}`;
}

function getTimeLeft(): string {
  let now = new Date();
  let night = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // the next day, ...
    0, 0, 0 // ...at 00:00:00 hours
  );

  return msToTime(night.getTime() - now.getTime())
}

let TimeLeft = () => {
  const [timeLeft, setTimeLeft] = useState<string>(getTimeLeft)
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearTimeout(timer)
  }, [timeLeft]);


  return <>
    <div className="text-lg ">
      Next puzzle:
      <span className="px-1 text-blue-800 font-semibold">
      {timeLeft}
    </span>
    </div>
  </>
}

let SuccessMessage = (props: {
  open: boolean,
  setOpen: any,
  gameState: GameState
}) => {
  let sharable = ""

  let totalSeconds = 0; // totalInSeconds(props.gameState.timePerRowInMs)
  let wordle = "Learnle #" + props.gameState.gameId + "\n";
  let fullToShare = wordle + "\n" + sharable + "\nlearnle.net";

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={props.setOpen}>
        <div
          className="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md spd:w-full sm:p-6">
              <div className="sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none "
                  onClick={() => props.setOpen(false)}>
                  <span className="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              <div>
                <div className="mt-3 text-left sm:mt-5">

                  <h1 className="text-green-800 text-xl pb-2">Success! 💪</h1>

                  <p className="py-1 text-gray-600">
                    Good job! The next puzzle will be published tomorrow.


                  </p>
                  <div>
                    The actual solution is: ja
                  </div>

                  <p className="py-1 text-gray-600">
                    Share your success with the world:
                  </p>
                  <div className="text-lg my-3 bg-blue-50 w-full p-5">
                    <pre className="font-mono"
                         style={{lineHeight: 1}}>{fullToShare}</pre>
                  </div>
                </div>

                <div className="border-t border-blue-200 mt-4 pt-4">
                  <TimeLeft/>
                </div>

              </div>
              <div className="mt-5 sm:mt-6 flex gap-1">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(fullToShare);
                    toast.success("Copied!")
                  }}>
                  Copy to share!
                </button>

                <a target="_blank"
                   className="no-underline inline-flex justify-center rounded-md border border-transparent shadow-sm py-2 bg-blue-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                   href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent(fullToShare)}>

                  <svg aria-hidden="true" focusable="false" data-prefix="fab"
                       data-icon="twitter-square" className="w-5 h-5 mx-2 text-white" role="img"
                       xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path fill="currentColor"
                          d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-48.9 158.8c.2 2.8.2 5.7.2 8.5 0 86.7-66 186.6-186.6 186.6-37.2 0-71.7-10.8-100.7-29.4 5.3.6 10.4.8 15.8.8 30.7 0 58.9-10.4 81.4-28-28.8-.6-53-19.5-61.3-45.5 10.1 1.5 19.2 1.5 29.6-1.2-30-6.1-52.5-32.5-52.5-64.4v-.8c8.7 4.9 18.9 7.9 29.6 8.3a65.447 65.447 0 0 1-29.2-54.6c0-12.2 3.2-23.4 8.9-33.1 32.3 39.8 80.8 65.8 135.2 68.6-9.3-44.5 24-80.6 64-80.6 18.9 0 35.9 7.9 47.9 20.7 14.8-2.8 29-8.3 41.6-15.8-4.9 15.2-15.2 28-28.8 36.1 13.2-1.4 26-5.1 37.8-10.2-8.9 13.1-20.1 24.7-32.9 34z"/>
                  </svg>
                </a>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}


export const SettingDialog = (props: { open: boolean, setOpen: any, settings: Settings, setSettings: any }) => {
  let setHideZero = (newValue: boolean) => {
    props.setSettings({...props.settings, hideZero: newValue})
  }

  let setHardCore = (newValue: boolean) => {
    props.setSettings({...props.settings, hardCore: newValue})
  }

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={props.setOpen}>
        <div
          className="flex items-center justify-center min-screen p-4 text-center sm:block sm:p-0 dark">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true">&#8203;</span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <div
              className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md spd:w-full sm:p-6">
              <div className="sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => props.setOpen(false)}>
                  <span className="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <div>
                <div className="mt-3 text-left sm:mt-5">
                  <h2 className="text-blue-800 text-2xl pb-1 border-b border-blue-200 dark:text-white">
                    Settings
                  </h2>

                  <div className="py-3 pt-4">
                    {/*<h1 className="text-blue-800 text-xl pb-2 ">About</h1>*/}
                    <div className="font-light">
                      <ul role="list" className="divide-y divide-gray-200">
                        <Switch.Group as="li" className="py-4 flex items-center justify-between">
                          <div className="flex flex-col">
                            <Switch.Label as="p" className="text-lg font-medium text-gray-900 dark:text-white" passive>
                              Hide Zero
                            </Switch.Label>

                            <Switch.Description className="text-gray-500 dark:text-white">
                              Hide words which appeared 0 times
                            </Switch.Description>
                          </div>
                          <Switch checked={props.settings.hideZero} onChange={setHideZero}
                                  className={classNames(
                                    props.settings.hideZero ? 'bg-teal-500' : 'bg-gray-200',
                                    'ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500'
                                  )}>
                            <span aria-hidden="true" className={classNames(
                              props.settings.hideZero ? 'translate-x-5' : 'translate-x-0',
                              'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200')}/>
                          </Switch>
                        </Switch.Group>
                      </ul>

                      <ul role="list" className="divide-y divide-gray-200">
                        <Switch.Group as="li" className="py-4 flex items-center justify-between">
                          <div className="flex flex-col">
                            <Switch.Label as="p" className="text-lg font-medium text-gray-900 dark:text-white" passive>
                              Senior Programmer Mode
                            </Switch.Label>

                            <Switch.Description className="text-gray-500 dark:text-white">
                              Instead of just finding the filename, your goal is to find the whole source code.
                            </Switch.Description>
                          </div>
                          <Switch checked={props.settings.hardCore} onChange={setHardCore}
                                  className={classNames(
                                    props.settings.hardCore ? 'bg-teal-500' : 'bg-gray-200',
                                    'ml-4 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500'
                                  )}>
                            <span aria-hidden="true" className={classNames(
                              props.settings.hardCore ? 'translate-x-5' : 'translate-x-0',
                              'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200')}/>
                          </Switch>
                        </Switch.Group>
                      </ul>

                    </div>
                  </div>

                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button type="button"
                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 dark:bg-slate-300 dark:text-black text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                        onClick={() => props.setOpen(false)}>Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
