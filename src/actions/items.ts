'use server';
/**
 * Server action to create items in a brain (links, notes, tweets, etc.).
 * Validates input with zod and revalidates related Next.js cache tags on success.
 */

import { auth } from '@/auth';
import { z } from 'zod';
import { revalidateTag } from 'next/cache';
import { CreateItemState } from '@/types/brain';



/** Input schema for create-item form. */
const CreateItemSchema = z.object({
  brainId: z.string().min(1, 'Missing brain'),
  type: z.enum(['tweet', 'video', 'note', 'link','other','youtube']),
  url: z
    .string()
    .optional()
    .transform((v) => (v && v.trim().length ? v.trim() : undefined))
    .refine((v) => (v ? /^https?:\/\//i.test(v) : true), {
      message: 'URL must start with http(s)://',
    }),
  title: z.string().min(1, 'Title is required'),
  content: z.string().optional(),
  tags: z
    .string()
    .optional()
    .transform((s) =>
      (s || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    ),
  pinned: z
    .union([z.literal('on'), z.literal('true'), z.literal('1'),z.literal('false')])
    .optional()
    .transform((v) => !!v),
});

/**
 * Creates an item under the provided brain and type.
 * Revalidates `${brainId}:${type}`, `${brainId}:all`, `${brainId}:count`, and `all-tag`.
 */
export async function CreateItemForBrain(
  _prev: CreateItemState,
  formData: FormData
): Promise<CreateItemState> {

    const session =await auth();
    const token = (session as any)?.accessToken;

    console.log('form data recieved',formData);
    // return {success:true ,errors:{}}
    if(formData == null){
        return  {errors:{},
        success:false}
    } 
    

  const parsed = CreateItemSchema.safeParse({
    brainId: formData.get('brainId'),
    type: formData.get('type'),
    url: formData.get('url'),
    title: formData.get('title'),
    content: formData.get('content'),
    tags: formData.get('tags'),
    pinned: formData.get('pinned'),
  });

  if (!parsed.success) {
    console.log('error in parsing', parsed.error.flatten().fieldErrors);
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { brainId, type, url, title, content, tags, pinned } = parsed.data;


  console.log('data recieved is ',brainId,type,url,title,content,tags,pinned)
//   return {success:true ,errors:{}}

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/item/${type}`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: 'no-store',
        body: JSON.stringify({ brainId ,url, title, content, tags, pinned }),
      }
    );

    console.log('reached the req ', res)
    if (!res.ok) {
      const msg = (await res.text().catch(() => '')) || 'Create failed';
      return { success: false, errors: { _form: [msg] } };
    }

    // keep your UI fresh
    revalidateTag(`${brainId}:${type}`);
    revalidateTag(`${brainId}:all`)
    revalidateTag('all-tag');
    revalidateTag(`${brainId}:count`)
    // optionally: revalidateTag('nav'); // if counts change in sidebar

    return { success: true, errors: {} };
  } catch (e: any) {
    return { success: false, errors: { _form: [e?.message || 'Network error'] } };
  }
}
