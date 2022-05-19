import {Dialog, Switch, Transition} from '@headlessui/react'
import {GameState, GameStats, Settings} from "../lib/types";
import {Fragment, useEffect, useState} from "react";
import classNames from "classnames";

export enum PopupToShow {
  NONE,
  SETTINGS,
  HELP,
}

export const PopupManager = (prop: {
  popupToShow: PopupToShow,
  onClose: () => void, settings: Settings, setSettings: any,
  gameState: GameState
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
  </>
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
