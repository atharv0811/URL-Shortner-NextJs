'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { z } from 'zod';
import axios from 'axios';

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    alias: z.string().optional(),
    url: z.string().url("Invalid URL format").min(1, "URL is required"),
});

interface ModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [alias, setAlias] = useState('');
    const [url, setUrl] = useState('');
    const [errors, setErrors] = useState<{ name?: string; alias?: string; url?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        const result = schema.safeParse({ name, alias, url });
        if (!result.success) {
            const fieldErrors: { [key: string]: string } = {};
            result.error.errors.forEach((error) => {
                if (error.path.length > 0) {
                    fieldErrors[error.path[0]] = error.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post('/api/url', { name, url, alias });
            if (response.data.success) {
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error("Error submitting form", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Link</DialogTitle>
                    <DialogDescription>Fill in the details below to create a new short link.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Input
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>
                    <div>
                        <Input
                            placeholder="URL"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        {errors.url && <p className="text-red-500 text-sm">{errors.url}</p>}
                    </div>
                    <div>
                        <Input
                            placeholder="Alias (optional)"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                        />
                        {errors.alias && <p className="text-red-500 text-sm">{errors.alias}</p>}
                    </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Shorten'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Modal;
