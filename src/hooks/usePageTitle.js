import { useEffect } from 'react'

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | tbagstore` : 'tbagstore | Golf accessories, coming soon'
  }, [title])
}
