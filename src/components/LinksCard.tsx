import React, { useState } from 'react'
import Link from 'next/link';
import { Check, Copy, Eye, LinkIcon, Trash, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from './ui/use-toast';

interface LinksCardProps {
  name: string;
  longUrl: string;
  shortUrl: string;
  clicks: number;
  shortId: string;
  fetchData: () => void;
}

const LinksCard = ({ name, longUrl, shortUrl, clicks, shortId, fetchData }: LinksCardProps) => {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const response = await axios.delete(`/api/delete-url/${shortId}`)

      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message
        })

        fetchData();
      }

    } catch (error) {
      toast({
        title: "Failed",
        description: "Internal server error"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
      <Link href={shortUrl} className="flex flex-col flex-1 space-y-4">
        <span className="text-3xl font-extrabold hover:underline cursor-pointer">
          {name}
        </span>
        <span className="text-2xl text-blue-400 font-bold hover:underline cursor-pointer">
          {shortUrl}
        </span>
        <span className="flex items-center gap-1 hover:underline cursor-pointer">
          <LinkIcon className="p-1" />
          {longUrl}
        </span>
      </Link>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          className='gap-4'
        >
          <Eye />
          <span>{clicks}</span>
        </Button>
        <Button
          variant="ghost"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="text-white" />
          ) : (
            <Copy />
          )}
        </Button>
        <Button
          variant="ghost"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? <Loader2 className='animate-spin' /> : <Trash />}
        </Button>
      </div>
    </div>
  )
}

export default LinksCard
