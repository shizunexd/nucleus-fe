'use client'
import Markdown from '@/components/layout/markdown'

export default function Home() {
    const mdContent = `
# Hello 👋

This is my app.

Click [here](/inventory/reset) to reset the sample data and account roles.

Click the links below (or use the navigation bar) to access other features
- [List of all products](/inventory) (View permission required, Create permission required to add new product)
- [List of all suppliers](/suppliers) (No permissions required)

As a guest, your access is limited. [Login](/login) using the default user accounts provided (all using password: \`password\`):
- \`generic_viewer\` - Only has \`view\` permission
- \`editor\` - In addition to the previous, also has \`create\` and \`update\`
- \`admin\` - In addition to the previous, also has \`delete\`
- \`root\` - In addition to the previous, also has \`user\` and \`role\`, which allows to change the Permissions of a \`Role\` and assign \`Role\` to a \`User\`

## Note: This version does not support auto-refreshing of roles yet.  
If you're logged in when your role was changed (eg, \`delete\` permission removed), your UI view will not be updated (Delete button still visible), however the action will fail.  
This is because some role info is stored in the JWT token on the frontend, used to control the UI logic.  
Ideally we would a system to refresh the token, but for now please log out and log in again.

`
    return (
        <main>
            <Markdown className="markdown">{mdContent}</Markdown>
        </main>
    )
}
