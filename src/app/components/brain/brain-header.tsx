"use client";

import * as React from "react";
import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Switch,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import {
  MoreVertical,
  Plus,
  Share2,
  Plug,
  Users,
  Check,
  Copy,
} from "lucide-react";
import { cn } from "@heroui/react";

/**
 * Header component for a brain detail page: shows name/description, quick create
 * menu, share modal, and optional extension connect UX.
 */

type Counts = {
  total?: number;
  tweets?: number;
  videos?: number;
  notes?: number;
  links?: number;
  other?: number;
  youtube?: number;
};

type BrainHeaderProps = {
  brainId: string;
  name: string;
  description?: string;
  counts?: Counts;

  /** Called when user picks a type to add (e.g., "tweet") */
  onCreate?: (type: 'tweet'| 'video'| 'note'| 'link'|'other'|'youtube' ) => void;

  /** Share options */
  isPublic?: boolean;
  onShareToggle?: (next: boolean) => Promise<void> | void;
  /** If not provided, we’ll compute `${location.origin}/share/${brainId}` on the client */
  shareUrl?: string;
  /** Invite collaborators (optional) */
  onInviteCollaborator?: (email: string) => Promise<void> | void;

  /** Extension connect */
  extensionUrl?: string; // Chrome web store (or your landing) URL
  onConnectExtension?: () => Promise<void> | void; // optional hook
};

export default function BrainHeader({
  brainId,
  name,
  description,
  counts,
  onCreate,
  isPublic: isPublicProp = false,
  onShareToggle,
  shareUrl,
  onInviteCollaborator,
  extensionUrl,
  onConnectExtension,
}: BrainHeaderProps) {
  const router = useRouter();

  // Add content dropdown
  const handleCreate = (type: 'tweet'| 'video'| 'note'| 'link'|'other'|'youtube' ) => {
    if (onCreate) return onCreate(type);
    // fallback: route to your composer
    router.push(`/dashboard/${brainId}/create?type=${type}`);
  };

  // Share modal
  const shareDisc = useDisclosure();
  const [isPublic, setIsPublic] = React.useState<boolean>(isPublicProp);
  const [shareBusy, setShareBusy] = React.useState(false);
  const [inviteBusy, setInviteBusy] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState("");

  React.useEffect(() => setIsPublic(isPublicProp), [isPublicProp]);

  const [resolvedShareUrl, setResolvedShareUrl] = React.useState(
    shareUrl || ""
  );
  React.useEffect(() => {
    if (!shareUrl && typeof window !== "undefined") {
      setResolvedShareUrl(`${window.location.origin}/share/${brainId}`);
    }
  }, [shareUrl, brainId]);

  async function togglePublic(next: boolean) {
    setIsPublic(next);
    if (!onShareToggle) return;
    try {
      setShareBusy(true);
      await onShareToggle(next);
    } finally {
      setShareBusy(false);
    }
  }

  // copy link UX
  const [copied, setCopied] = React.useState(false);
  async function copyLink() {
    if (!resolvedShareUrl) return;
    await navigator.clipboard.writeText(resolvedShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  async function handleInvite() {
    if (!inviteEmail || !onInviteCollaborator) return;
    try {
      setInviteBusy(true);
      await onInviteCollaborator(inviteEmail);
      setInviteEmail("");
    } finally {
      setInviteBusy(false);
    }
  }

  // Extension modal
  const extDisc = useDisclosure();
  const [extBusy, setExtBusy] = React.useState(false);
  async function connectExtension() {
    try {
      setExtBusy(true);
      if (onConnectExtension) await onConnectExtension();
      if (extensionUrl)
        window.open(extensionUrl, "_blank", "noopener,noreferrer");
    } finally {
      setExtBusy(false);
    }
  }

  const c = {
    total: counts?.total ?? 0,
    tweets: counts?.tweets ?? 0,
    videos: counts?.videos ?? 0,
    docs: counts?.notes ?? 0,
    links: counts?.links ?? 0,
    other: counts?.other ?? 0,
    youtube: counts?.youtube ?? 0
  };

  return (
    <>
      <Card className="mb-4">
        <CardBody className="flex flex-col gap-3 md:gap-2 md:flex-row md:items-center md:justify-between">
          {/* Left: name + description */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-semibold truncate">
                {name}
              </h1>
              <Tooltip content={isPublic ? "Public" : "Private"}>
                <span
                  className={cn(
                    "inline-block text-xs px-2 py-0.5 rounded",
                    isPublic
                      ? "bg-success-100 text-success-700"
                      : "bg-warning-100 text-warning-700"
                  )}
                >
                  {isPublic ? "Public" : "Private"}
                </span>
              </Tooltip>
            </div>
            {description ? (
              <p className="opacity-75 mt-1 line-clamp-2">{description}</p>
            ) : (
              <p className="opacity-50 mt-1 text-sm">No description.</p>
            )}
            {/* Counters */}
            <div className="flex flex-wrap gap-2 mt-2">
              <Counter label="Total" value={c.total} />
              <Counter label="Tweets" value={c.tweets} />
              <Counter label="Videos" value={c.videos} />
              <Counter label="Docs" value={c.docs} />
              <Counter label="Links" value={c.links} />
              <Counter label="Other" value={c.other} />
              <Counter label="YouTube" value={c.youtube} />
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Add content (always visible) */}
            <Dropdown>
              <DropdownTrigger>
                <Button color="primary" startContent={<Plus size={16} />}>
                  Add content
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Add content"
                onAction={(key) => handleCreate(key as any)}
              >
                <DropdownItem key="tweet">Tweet</DropdownItem>
                <DropdownItem key="video">Video</DropdownItem>
                <DropdownItem key="note">Doc</DropdownItem>
                <DropdownItem key="link">Link</DropdownItem>
                <DropdownItem key="other">Other</DropdownItem>
                <DropdownItem key="youtube">YouTube</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            {/* Share (md and up) */}
            <Button
              className="hidden md:inline-flex"
              variant="flat"
              startContent={<Share2 size={16} />}
              onPress={shareDisc.onOpen}
            >
              Share
            </Button>

            {/* Connect (md and up) */}
            <Button
              className="hidden md:inline-flex"
              variant="flat"
              startContent={<Plug size={16} />}
              onPress={extDisc.onOpen}
            >
              Connect
            </Button>

            {/* Overflow menu (only on small screens) */}
            <div className="md:hidden">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly variant="light" aria-label="More">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="More actions">
                  <DropdownItem key="share" onPress={shareDisc.onOpen}>
                    Share brain
                  </DropdownItem>
                  <DropdownItem key="connect" onPress={extDisc.onOpen}>
                    Connect extension
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Share Modal */}
      <Modal
        isOpen={shareDisc.isOpen}
        onOpenChange={shareDisc.onOpenChange}
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>Share this brain</ModalHeader>
              <ModalBody>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">Public access</div>
                    <div className="text-xs opacity-70">
                      Allow anyone with the link to view (no edit).
                    </div>
                  </div>
                  <Switch
                    isSelected={isPublic}
                    onValueChange={togglePublic}
                    isDisabled={shareBusy}
                    aria-label="Toggle public access"
                  >
                    {isPublic ? "On" : "Off"}
                  </Switch>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    label="Share link"
                    value={resolvedShareUrl}
                    isReadOnly
                    className="flex-1"
                  />
                  <Button
                    variant="flat"
                    startContent={
                      copied ? <Check size={16} /> : <Copy size={16} />
                    }
                    onPress={copyLink}
                  >
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>

                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={16} />
                    <span className="font-medium">Invite collaborator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="email"
                      placeholder="name@email.com"
                      value={inviteEmail}
                      onValueChange={setInviteEmail}
                      isDisabled={inviteBusy}
                    />
                    <Button
                      variant="flat"
                      onPress={handleInvite}
                      isDisabled={!inviteEmail || !onInviteCollaborator}
                      isLoading={inviteBusy}
                    >
                      Invite
                    </Button>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Extension Modal */}
      <Modal
        isOpen={extDisc.isOpen}
        onOpenChange={extDisc.onOpenChange}
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>Connect browser extension</ModalHeader>
              <ModalBody>
                <p className="opacity-80">
                  Install the extension to save tweets, videos, docs, and links
                  directly to <b>{name}</b>.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    color="secondary"
                    startContent={<Plug size={16} />}
                    onPress={connectExtension}
                    isLoading={extBusy}
                  >
                    {extensionUrl ? "Open extension page" : "Run connect hook"}
                  </Button>
                </div>
                {!extensionUrl && (
                  <p className="text-xs opacity-60">
                    Pass <code>extensionUrl</code> to open a store/listing page.
                  </p>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

function Counter({ label, value }: { label: string; value: number }) {
  return (
    <span className="text-xs rounded-full px-2 py-1 bg-content2">
      <b className="mr-1">{value}</b>
      <span className="opacity-70">{label}</span>
    </span>
  );
}
