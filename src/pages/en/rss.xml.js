import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

export async function GET(context) {
	const posts = await getCollection('blog');
	const enPosts = posts.filter((post) => post.id.startsWith('en/'));
	return rss({
		title: 'Materia Programable (English)',
		description: 'Exploring the future of programmable matter: AI, nanotechnology, soft robotics, self-assembly and neuromorphic computing.',
		site: context.site,
		items: enPosts.map((post) => ({
			...post.data,
			link: `/blog/${post.id}/`,
		})),
	});
}
