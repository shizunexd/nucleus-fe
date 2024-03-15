import Link from 'next/link'
import Markdown from '@/components/layout/markdown'

export default function NotFound() {
    const mdContent = `
# Page Not found 😔

Could not find requested resource. 

Please try logging in first, or you may not have the necessary permissions to view this page.
`
    return (
        <div>
            <Markdown className="markdown">{mdContent}</Markdown>
            <Link href="/">Return Home</Link>
        </div>
    )
}
