import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import {
  getSupabase,
  isSupabaseConfigured,
  type CommentRow,
} from '../lib/supabase';

const MIN_SUBMIT_DELAY_MS = 3000;
const MAX_AUTHOR_LENGTH = 80;
const MAX_BODY_LENGTH = 4000;

type CommentStrings = {
  title: string;
  notConfigured: string;
  placeholder: string;
  submit: string;
  empty: string;
  loading: string;
  error: string;
  displayName: string;
  anonymous: string;
  waitToSubmit: string;
};

type Props = {
  slug: string;
  lang: string;
  strings: CommentStrings;
};

export default function Comments({ slug, lang, strings }: Props) {
  const supabase = useMemo(() => getSupabase(), []);
  const configured = isSupabaseConfigured();
  const mountedAt = useRef(Date.now());

  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [body, setBody] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    configured &&
    body.trim().length > 0 &&
    Date.now() - mountedAt.current >= MIN_SUBMIT_DELAY_MS;

  const loadComments = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('comments')
      .select('*')
      .eq('slug', slug)
      .eq('lang', lang)
      .eq('is_approved', true)
      .order('created_at', { ascending: true });

    if (fetchError) {
      setError(strings.error);
    } else {
      setComments(data ?? []);
    }
    setLoading(false);
  }, [supabase, slug, lang, strings.error]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    void loadComments();

    const channel = supabase
      .channel(`comments:${slug}:${lang}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `slug=eq.${slug}`,
        },
        () => {
          void loadComments();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, slug, lang, loadComments]);

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (!supabase || !canSubmit || submitting) return;
    if (honeypot.trim()) return;

    const trimmedBody = body.trim();
    const trimmedName = displayName.trim();
    if (!trimmedBody || trimmedBody.length > MAX_BODY_LENGTH) return;
    if (trimmedName.length > MAX_AUTHOR_LENGTH) return;

    setSubmitting(true);
    setError(null);

    const author = trimmedName || strings.anonymous;

    const { error: insertError } = await supabase.from('comments').insert({
      slug,
      lang,
      author_name: author,
      body: trimmedBody,
    });

    if (insertError) {
      setError(insertError.message || strings.error);
    } else {
      setBody('');
      setDisplayName('');
      await loadComments();
    }
    setSubmitting(false);
  };

  if (!configured) {
    return <p class="comment-notice">{strings.notConfigured}</p>;
  }

  return (
    <div class="comments-root">
      {error && <p class="comment-notice">{error}</p>}

      <form class="comment-form" onSubmit={handleSubmit}>
        <label class="comment-honeypot" aria-hidden="true">
          <span>Leave blank</span>
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onInput={(e) => setHoneypot((e.target as HTMLInputElement).value)}
          />
        </label>
        <input
          type="text"
          maxLength={MAX_AUTHOR_LENGTH}
          placeholder={strings.displayName}
          value={displayName}
          onInput={(e) => setDisplayName((e.target as HTMLInputElement).value)}
        />
        <textarea
          required
          maxLength={MAX_BODY_LENGTH}
          placeholder={strings.placeholder}
          value={body}
          onInput={(e) => setBody((e.target as HTMLTextAreaElement).value)}
        />
        <button type="submit" class="btn-primary" disabled={submitting || !canSubmit}>
          {strings.submit}
        </button>
        {!canSubmit && body.trim() && (
          <p class="comment-notice comment-wait">{strings.waitToSubmit}</p>
        )}
      </form>

      {loading ? (
        <p class="comment-notice">{strings.loading}</p>
      ) : comments.length === 0 ? (
        <p class="comment-notice">{strings.empty}</p>
      ) : (
        <ul class="comment-list">
          {comments.map((comment) => (
            <li class="comment-item" key={comment.id}>
              <div class="comment-meta">
                {comment.author_name ?? strings.anonymous} ·{' '}
                {new Date(comment.created_at).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US')}
              </div>
              <p class="comment-body">{comment.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
