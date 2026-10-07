import { useNavigate } from 'react-router'
import { ActivityCard } from '@/components/gym/ActivityCard'
import { NearbyGymsPreview } from '@/components/gym/NearbyGymsPreview'
import { ProgressStats } from '@/components/progress/ProgressStats'
import { Page } from '@/components/ui/Page'
import { SearchBar } from '@/components/ui/SearchBar'
import { useCurrentUser } from '@/features/auth/auth-context'
import { MODALITIES } from '@/types/api'
import { getFirstName } from '@/utils/format'
import { TodayStatus } from './TodayStatus'

export function HomePage() {
  const user = useCurrentUser()
  const navigate = useNavigate()

  return (
    <Page className="gap-10">
      <header className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-h1 font-extrabold font-expanded sm:text-display">
            Olá, {getFirstName(user.name)} <span aria-hidden>👋</span>
          </h1>
          <TodayStatus />
        </div>
        <SearchBar
          className="max-w-2xl"
          onSearch={(query) => navigate(query ? `/explore?q=${encodeURIComponent(query)}` : '/explore')}
        />
      </header>

      <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
        <NearbyGymsPreview />
        <ProgressStats className="xl:sticky xl:top-10" />
      </div>

      <section aria-labelledby="activities-title" className="flex flex-col gap-4">
        <h2 id="activities-title" className="text-h2 font-bold">
          Explore atividades
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {MODALITIES.map((modality) => (
            <li key={modality}>
              <ActivityCard modality={modality} />
            </li>
          ))}
        </ul>
      </section>
    </Page>
  )
}
