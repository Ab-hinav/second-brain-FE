"use client";

import { Card, CardHeader, CardBody, CardFooter, Link, Chip } from "@heroui/react";
import { BrainItem } from "@/types/brain";
import { Twitter, Youtube, FileText, Video, Link as LinkIcon, MoreHorizontal } from "lucide-react";

const TypeIcon: Record<string, any> = {
  tweet: Twitter,
  video: Video,
  youtube: Youtube,
  note: FileText,
  link: LinkIcon,
  other: MoreHorizontal,
};

export default function ItemCard({ item }: { item: BrainItem }) {
  const Icon = TypeIcon[item.type] || FileText;

  return (
    <Card className="h-full border border-transparent hover:border-default-200 transition-colors shadow-sm">
      <CardHeader className="flex justify-between items-start gap-2 pb-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 bg-default-100 rounded-md shrink-0 text-default-500">
             <Icon size={18} />
          </div>
          <h4 className="font-semibold text-medium truncate" title={item.title}>
            {item.title}
          </h4>
        </div>
        {item.pinned && (
          <Chip size="sm" color="warning" variant="flat" className="shrink-0 h-6">
            Pinned
          </Chip>
        )}
      </CardHeader>

      <CardBody className="py-3 px-3">
        {item.type === 'note' ? (
           <div className="text-small text-default-500 line-clamp-4 whitespace-pre-wrap min-h-[3rem]">
             {item.content || "No content"}
           </div>
        ) : (
           <div className="min-h-[3rem]">
             <Link
               isExternal
               href={item.url}
               showAnchorIcon
               className="text-small text-primary line-clamp-2 break-all"
             >
                {item.url}
             </Link>
             {item.content && (
                <p className="mt-2 text-tiny text-default-400 line-clamp-2">
                    {item.content}
                </p>
             )}
           </div>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {item.tags.map((t) => (
              <Chip key={t} size="sm" variant="flat" className="text-tiny h-6">
                #{t}
              </Chip>
            ))}
          </div>
        )}
      </CardBody>

      <CardFooter className="pt-0 pb-3 px-3 text-tiny text-default-400">
        {new Date(item.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })}
      </CardFooter>
    </Card>
  );
}
