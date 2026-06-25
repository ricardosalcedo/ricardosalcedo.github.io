import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const markdownContent = `# Ricardo Salcedo (@ricardosalcedo)

Software engineer with 23 years of shipping code. AI-augmented workflows for high-velocity delivery.

## Navigation

- [About](/about.md)
- [Recent Posts](/posts.md)
- [Archives](/archives.md)
- [RSS Feed](/rss.xml)

## Links

- GitHub: [@ricardosalcedo](https://github.com/ricardosalcedo)
- LinkedIn: [Ricardo Salcedo](https://www.linkedin.com/in/ricardo-s-98283913/)
- Email: ricardo.salcedo@gmail.com

---

*Visit [ricardosalcedo.github.io](https://ricardosalcedo.github.io) for the full experience.*`;

  return new Response(markdownContent, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
