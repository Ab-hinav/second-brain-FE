
import { Chip } from "@heroui/react";
import { Hash } from "lucide-react";

/** Renders a simple list of tags with colored chips in the sidebar. */
export default function TagList({allTags}:{
    allTags: {name: string, color: string}[]
}){


    return <>{allTags.length > 0 && (
        <div className="mt-6 pt-4 border-t border-sidebar-border">
          <h3 className="text-sidebar-foreground mb-2 px-2 flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Tags
          </h3>
          <div className="flex flex-wrap space-y-1">
            {allTags.map((tag,idx) => (
              <div key={idx} className="px-1">
                <Chip 
                  radius="full"
                  style={{ borderColor: tag.color, color: tag.color }}
                >
                  #{tag.name}
                </Chip>
              </div>
            ))}
          </div>
        </div>
      )}</>


}
