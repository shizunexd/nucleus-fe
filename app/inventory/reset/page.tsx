'use server'
import Markdown from '@/components/layout/markdown'

export default async function Reset() {
    let mdContent = `# Successfully reloaded data to the default state ✅
To reload again, simply refresh this page`
    const errorContent = `# Something went wrong, please try again`
    try {
        let resp = await fetch(`${process.env.API_URL}/api/reload-database`, {
            cache: 'no-store',
            method: 'POST',
        })
    } catch (e) {
        mdContent = errorContent
    }

    return (
        <main>
            <Markdown className="markdown">{mdContent}</Markdown>
        </main>
    )
}
