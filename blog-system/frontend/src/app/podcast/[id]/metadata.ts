import { Metadata } from "next";

// 为每个播客生成元数据
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // 这里可以从API或数据库获取播客信息
  // 这是一个示例实现，实际使用时需要替换为真实的数据获取逻辑
  const podcast = {
    title: `播客 #${params.id}`, // 使用id作为标题（示例）
    description: `这是播客 #${params.id} 的详细内容`,
  };

  return {
    title: podcast.title, // 这将显示为 "播客 #ID | 十八加十八"
    description: podcast.description,
    openGraph: {
      title: `${podcast.title} | 十八加十八`,
      description: podcast.description,
    },
  };
}
