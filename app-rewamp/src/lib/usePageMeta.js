import { useEffect } from 'react'

function upsertMeta(attr, key, value, tracked) {
  if (!value) return
  const selector = `meta[${attr}="${key}"]`
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
    tracked.push({ el, created: true, attr, key, prev: null })
    el.setAttribute('content', value)
    return
  }
  tracked.push({ el, created: false, attr, key, prev: el.getAttribute('content') })
  el.setAttribute('content', value)
}

function upsertLink(rel, href, tracked) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
    tracked.push({ el, created: true, prev: null, isLink: true })
    el.setAttribute('href', href)
    return
  }
  tracked.push({ el, created: false, prev: el.getAttribute('href'), isLink: true })
  el.setAttribute('href', href)
}

export function usePageMeta({ title, description, keywords, image, path }) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title

    const origin = window.location.origin
    const url = path ? `${origin}${path}` : window.location.href
    const imageUrl = image
      ? image.startsWith('http')
        ? image
        : `${origin}${image}`
      : ''

    const tracked = []
    upsertMeta('name', 'description', description, tracked)
    upsertMeta('name', 'keywords', keywords, tracked)
    upsertMeta('property', 'og:title', title, tracked)
    upsertMeta('property', 'og:description', description, tracked)
    upsertMeta('property', 'og:type', 'website', tracked)
    upsertMeta('property', 'og:url', url, tracked)
    upsertMeta('property', 'og:image', imageUrl, tracked)
    upsertMeta('name', 'twitter:card', imageUrl ? 'summary_large_image' : 'summary', tracked)
    upsertMeta('name', 'twitter:title', title, tracked)
    upsertMeta('name', 'twitter:description', description, tracked)
    upsertMeta('name', 'twitter:image', imageUrl, tracked)
    upsertLink('canonical', url, tracked)

    return () => {
      document.title = prevTitle
      tracked.forEach((item) => {
        if (item.created) {
          item.el.remove()
          return
        }
        if (item.isLink) {
          if (item.prev == null) item.el.removeAttribute('href')
          else item.el.setAttribute('href', item.prev)
          return
        }
        if (item.prev == null) item.el.removeAttribute('content')
        else item.el.setAttribute('content', item.prev)
      })
    }
  }, [title, description, keywords, image, path])
}
