export default function TrustBannerFooter({ showToast }) {
  return (
    <>
      {/* Trust Banner */}
      <section className="bg-gradient-to-r from-teal-50 via-emerald-50 to-sky-50 rounded-2xl p-5 border border-teal-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">
              Transparency builds trust. Together we create a safer world.
            </h4>
            <p className="text-xs text-slate-500">
              Every resource and donation is fully auditable and directly dispatched to the frontlines.
            </p>
          </div>
        </div>
        <button
          onClick={() => showToast('Thank you for making an impact on the ground!')}
          style={{ backgroundColor: '#0f766e', color: '#ffffff' }}
          className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-900/20 whitespace-nowrap flex items-center gap-1.5 transition cursor-pointer"
        >
          <span>Keep Helping</span>
          <span>❤️</span>
        </button>
      </section>

      {/* Footer Note */}
      <footer className="pt-2 pb-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="text-rose-500">🤍</span>
          <span>Every rescue counts. Thank you for making a difference.</span>
        </div>
        <div className="italic text-slate-400 font-serif">
          "Service to humanity is service to God."
        </div>
      </footer>
    </>
  )
}
