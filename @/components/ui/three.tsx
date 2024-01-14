"use client";

import React from "react";
import { ArrowLeftIcon, FileIcon, ChevronDown, FolderIcon } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronRight, type LucideIcon } from "lucide-react";
import useResizeObserver from "use-resize-observer";
import { cn } from "@/lib/utils";
import { Document } from "@prisma/client";
import { Icons } from "../general/icons";

interface TreeDataItem extends Document {
  icon?: LucideIcon;
  children?: TreeDataItem[];
  leafLoading?: string;
}

type TreeProps = React.HTMLAttributes<HTMLDivElement> & {
  data: TreeDataItem[] | TreeDataItem;
  initialSelectedItemId?: string;
  onSelectChange?: (item: TreeDataItem | undefined) => void;
  expandAll?: boolean;
  itemIcon?: LucideIcon;
  leafLoading?: string;
};

const Tree = React.forwardRef<HTMLDivElement, TreeProps>(
  (
    {
      data,
      initialSelectedItemId,
      onSelectChange,
      expandAll,
      className,
      leafLoading,
      ...props
    },
    ref,
  ) => {
    const [selectedItemId, setSelectedItemId] = React.useState<
      string | undefined
    >(initialSelectedItemId);

    const handleSelectChange = React.useCallback(
      (item: TreeDataItem | undefined) => {
        setSelectedItemId(item?.id);
        if (onSelectChange) {
          onSelectChange(item);
        }
      },
      [onSelectChange],
    );

    const expandedItemIds = React.useMemo(() => {
      if (!initialSelectedItemId) {
        return [] as string[];
      }

      const ids: string[] = [];

      function walkTreeItems(
        items: TreeDataItem[] | TreeDataItem,
        targetId: string,
      ) {
        if (items instanceof Array) {
          // eslint-disable-next-line @typescript-eslint/prefer-for-of
          for (let i = 0; i < items.length; i++) {
            ids.push(items[i]!.id);
            if (walkTreeItems(items[i]!, targetId) && !expandAll) {
              return true;
            }
            if (!expandAll) ids.pop();
          }
        } else if (!expandAll && items.id === targetId) {
          return true;
        } else if (items.children) {
          return walkTreeItems(items.children, targetId);
        }
      }

      walkTreeItems(data, initialSelectedItemId);
      return ids;
    }, [data, initialSelectedItemId]);

    const { ref: refRoot, width, height } = useResizeObserver();

    return (
      <div ref={refRoot} className={cn("overflow-hidden", className)}>
        <div
          className="overflow-auto"
          style={
            {
              /*width, height*/
            }
          }
        >
          <div className="relative p-2">
            <TreeItem
              data={data}
              ref={ref}
              selectedItemId={selectedItemId}
              handleSelectChange={handleSelectChange}
              expandedItemIds={expandedItemIds}
              leafLoading={leafLoading}
              {...props}
            />
          </div>
        </div>
      </div>
    );
  },
);

type TreeItemProps = TreeProps & {
  selectedItemId?: string;
  handleSelectChange: (item: TreeDataItem | undefined) => void;
  expandedItemIds: string[];
};

const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      className,
      data,
      selectedItemId,
      handleSelectChange,
      expandedItemIds,
      leafLoading,
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} role="tree" className={className} {...props}>
        <ul>
          {data instanceof Array ? (
            data.map((item) => (
              <li key={item.id}>
                {item.children ? (
                  <AccordionPrimitive.Root
                    type="multiple"
                    defaultValue={expandedItemIds}
                  >
                    <AccordionPrimitive.Item value={item.id}>
                      <AccordionTrigger
                        isFolder={item.isFolder}
                        className={cn(
                          "px-2 before:absolute before:left-0 before:-z-10 before:h-[1.75rem] before:w-full before:bg-muted/80 before:opacity-0 hover:before:opacity-100",
                          selectedItemId === item.id &&
                            "text-accent-foreground before:border-l-2 before:border-l-accent-foreground/50 before:bg-accent before:opacity-100 dark:before:border-0",
                        )}
                        isLoading={leafLoading === item.id}
                        onClick={() => handleSelectChange(item)}
                      >
                        {item.isFolder ? (
                          <FolderIcon
                            className="mr-2 h-4 w-4 shrink-0 text-accent-foreground/50"
                            aria-hidden="true"
                          />
                        ) : (
                          <FileIcon
                            className="mr-2 h-4 w-4 shrink-0 text-accent-foreground/50"
                            aria-hidden="true"
                          />
                        )}
                        <span className="truncate text-sm">
                          {item.pathName}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pl-6">
                        <TreeItem
                          data={item.children ? item.children : item}
                          selectedItemId={selectedItemId}
                          handleSelectChange={handleSelectChange}
                          expandedItemIds={expandedItemIds}
                        />
                      </AccordionContent>
                    </AccordionPrimitive.Item>
                  </AccordionPrimitive.Root>
                ) : (
                  <Leaf
                    item={item}
                    isSelected={selectedItemId === item.id}
                    onClick={() => handleSelectChange(item)}
                  />
                )}
              </li>
            ))
          ) : (
            <li>
              <Leaf
                item={data}
                isSelected={selectedItemId === data.id}
                onClick={() => handleSelectChange(data)}
              />
            </li>
          )}
        </ul>
      </div>
    );
  },
);

const Leaf = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    item: TreeDataItem;
    isSelected?: boolean;
  }
>(({ className, item, isSelected, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex cursor-pointer items-center px-2 py-2 before:absolute before:left-0 before:right-1 before:-z-10 before:h-[1.75rem] before:w-full before:bg-muted/80 before:opacity-0 hover:before:opacity-100",
        className,
        isSelected &&
          "text-accent-foreground before:border-l-2 before:border-l-accent-foreground/50 before:bg-accent before:opacity-100 dark:before:border-0",
      )}
      {...props}
    >
      {item.isFolder ? (
        <FolderIcon
          className="mr-2 h-4 w-4 shrink-0 text-accent-foreground/50"
          aria-hidden="true"
        />
      ) : (
        <FileIcon
          className="mr-2 h-4 w-4 shrink-0 text-accent-foreground/50"
          aria-hidden="true"
        />
      )}
      <span className="flex-grow truncate text-sm">{item.pathName}</span>
    </div>
  );
});

const RightAccordionTriggerElement = ({
  isFolder,
  isLoading,
}: {
  isFolder: boolean;
  isLoading: boolean;
}) => {
  if (!isFolder) return null;
  if (isLoading) {
    return (
      <Icons.spinner className="ml-auto h-4 w-4 shrink-0 text-accent-foreground/50 " />
    );
  }
  return (
    <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-accent-foreground/50 transition-transform duration-200" />
  );
};

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    isLoading: boolean;
    isFolder: boolean;
  }
>(({ className, isLoading, isFolder, children, ...props }, ref) => (
  <AccordionPrimitive.Header>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex w-full flex-1 items-center py-2 transition-all",
        className,
        isFolder && "last:[&[data-state=open]>svg]:rotate-90",
      )}
      {...props}
    >
      {children}
      <RightAccordionTriggerElement isFolder={isFolder} isLoading={isLoading} />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm transition-all data-[state=open]:animate-accordion-down",
      className,
    )}
    {...props}
  >
    <div className="pb-1 pt-0">{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Tree, type TreeDataItem };
