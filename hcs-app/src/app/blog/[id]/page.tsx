import { ModernHeader } from "@/components/ui/modern-header";
import { ModernFooter } from "@/components/ui/modern-footer";
import { BlogPostContent } from "@/components/ui/blog-post-content";
import { BlogComments } from "@/components/ui/blog-comments";
import { RelatedArticles } from "@/components/ui/related-articles";

interface BlogPostPageProps {
	params: {
		id: string;
	};
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
	return (
		<main className="min-h-screen bg-background">
			<ModernHeader />

			{/* Main Blog Post Content */}
			<BlogPostContent postId={params.id} />

			{/* Comments Section */}
			<BlogComments postId={params.id} />

			{/* Related Articles */}
			<RelatedArticles postId={params.id} />

			<ModernFooter />
		</main>
	);
}
