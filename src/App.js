import { useState } from 'react';
import AppComponent from './AppComponent';
import './App.css';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


export default function App() {

  return (
    <>
      <div>
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">Builds</h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Replace with your content */}
              <div className="py-4">
                <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
                  <AppComponent />
                </div>
              </div>
              {/* /End replace */}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
