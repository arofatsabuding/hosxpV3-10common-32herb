import { execSync } from 'child_process';

export async function GET() {
    try {
        const version = execSync('git describe --tags --abbrev=0').toString().trim();
        return Response.json({ version });
    } catch (error) {
        return Response.json({ error: 'No version found' }, { status: 500 });
    }
}
