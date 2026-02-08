export default function Accounts() {
  return (
    <div className="px-5 pt-14">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Accounts</h1>
        <button className="border border-gray-200 rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-1">
          + Add
        </button>
      </div>

      {/* Instant */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-400">Instant</p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-300">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="border border-gray-100 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-500">
              <path d="M10.75 10.818a4 4 0 10-1.5 0A5.002 5.002 0 005 15.5a.75.75 0 001.5 0 3.5 3.5 0 117 0 .75.75 0 001.5 0 5.002 5.002 0 00-4.25-4.682z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm">Bounce Pay</p>
            <p className="text-xs text-gray-400">$0.00</p>
          </div>
        </div>
      </section>

      {/* Linked Bank Accounts */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-400">Linked Bank Accounts</p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-300">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="space-y-2">
          <div className="border border-gray-100 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              RBC
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">RBC Royal Bank</p>
              <p className="text-xs text-gray-400">RBC Advantage Banking</p>
            </div>
            <span className="text-xs text-gray-400">Default</span>
          </div>
          <div className="border border-gray-100 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              RBC
            </div>
            <div>
              <p className="font-semibold text-sm">RBC Royal Bank</p>
              <p className="text-xs text-gray-400">RBC High Interest eSavings</p>
            </div>
          </div>
        </div>
      </section>

      <button className="w-full bg-bounce text-black font-semibold py-3.5 rounded-full text-sm">
        Transfer Between Accounts
      </button>
    </div>
  );
}
