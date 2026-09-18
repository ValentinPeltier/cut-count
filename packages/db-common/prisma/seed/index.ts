import { spawnSync } from 'node:child_process'

const runWorkspaceSeed = (workspace: string) => {
    console.log(`\n> yarn workspace ${workspace} tsx prisma/seed/index.ts`)

    const result = spawnSync('yarn', ['workspace', workspace, 'tsx', 'prisma/seed/index.ts'], {
        stdio: 'inherit',
    })

    return result.status === 0
}

const main = async () => {
    if (!runWorkspaceSeed('bilan-carbone')) {
        throw new Error('Seed failed for bilan-carbone')
    }
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
