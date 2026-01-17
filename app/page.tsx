import TaskList from '@/components/TaskList'
import AppFooter from '@/components/AppFooter'

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 pb-24">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            MyBooTime
          </h1>
          <p className="text-white/80 text-sm md:text-base">
            Task Reminder with Voice Notifications
          </p>
        </header>

        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20">
          <TaskList />
        </div>

        <footer className="text-center mt-8 text-white/60 text-sm">
          <p>© 2026 MyBooTime.</p>
        </footer>
      </div>
      <AppFooter />
    </main>
  )
}
