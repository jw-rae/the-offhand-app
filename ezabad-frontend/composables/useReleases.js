// Data access is done via queryCollection('releases') + useAsyncData in each consumer.
// This composable provides shared utility functions only.

export const useReleases = () => {
    const formatDate = (dateStr) =>
        new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        })

    const thumbUrl = (videoId, quality = 'hq') =>
        `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`

    const releasePath = (r) => `/catalog/${r.slug}`

    return { formatDate, thumbUrl, releasePath }
}
