import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import {
  getSupabase,
  isSupabaseConfigured,
  type CommentRow,
  type ProfileRow,
} from '../lib/supabase';

type CommentStrings = {
  title: string;
  signIn: string;
  emailPlaceholder: string;
  sendMagicLink: string;
  signInGoogle: string;
  signOut: string;
  placeholder: string;
  submit: string;
  empty: string;
  loading: string;
  error: string;
  displayName: string;
};

type Props = {
  slug: string;
  lang: string;
  strings: CommentStrings;
};

export default function Comments({ slug, lang, strings }: Props) {
  const supabase = useMemo(() => getSupabase(), []);
  const configured = isSupabaseConfigured();

  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [body, setBody] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  const loadProfile = useCallback(
    async (uid: string) => {
      if (!supabase) return;
      const { data } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', uid)
        .maybeSingle<Pick<ProfileRow, 'display_name'>>();
      setProfileName(data?.display_name ?? null);
    },
    [supabase],
  );

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

    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      if (session?.user) {
        setUserId(session.user.id);
        setUserEmail(session.user.email ?? null);
        void loadProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setUserEmail(session.user.email ?? null);
        void loadProfile(session.user.id);
      } else {
        setUserId(null);
        setUserEmail(null);
        setProfileName(null);
      }
    });

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
      subscription.unsubscribe();
      void supabase.removeChannel(channel);
    };
  }, [supabase, slug, lang, loadComments, loadProfile]);

  const handleMagicLink = async (event: Event) => {
    event.preventDefault();
    if (!supabase || !email.trim()) return;
    setAuthMessage(null);
    setError(null);
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`;
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    });
    if (authError) {
      setError(authError.message);
    } else {
      setAuthMessage('Check your email for the magic link.');
    }
  };

  const handleGoogle = async () => {
    if (!supabase) return;
    setError(null);
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`;
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (authError) setError(authError.message);
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setBody('');
  };

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (!supabase || !userId || !body.trim()) return;
    setSubmitting(true);
    setError(null);

    const author =
      displayName.trim() ||
      profileName ||
      userEmail?.split('@')[0] ||
      'Anonymous';

    if (displayName.trim() && displayName.trim() !== profileName) {
      await supabase.from('profiles').upsert({
        id: userId,
        display_name: displayName.trim(),
        updated_at: new Date().toISOString(),
      });
      setProfileName(displayName.trim());
    }

    const { error: insertError } = await supabase.from('comments').insert({
      slug,
      lang,
      user_id: userId,
      author_name: author,
      body: body.trim(),
      is_approved: true,
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      setBody('');
      await loadComments();
    }
    setSubmitting(false);
  };

  if (!configured) {
    return (
      <p class="comment-notice">
        Comments are not configured yet. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY.
      </p>
    );
  }

  return (
    <div class="comments-root">
      {error && <p class="comment-notice">{error}</p>}
      {authMessage && <p class="comment-notice">{authMessage}</p>}

      {!userId ? (
        <div class="comment-auth">
          <p>{strings.signIn}</p>
          <form onSubmit={handleMagicLink}>
            <input
              type="email"
              required
              placeholder={strings.emailPlaceholder}
              value={email}
              onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
            />
            <button type="submit" class="btn-primary">
              {strings.sendMagicLink}
            </button>
          </form>
          <button type="button" class="btn-secondary" onClick={handleGoogle}>
            {strings.signInGoogle}
          </button>
        </div>
      ) : (
        <form class="comment-form" onSubmit={handleSubmit}>
          <p class="comment-meta">
            {userEmail}
            <button type="button" class="btn-secondary" onClick={handleSignOut} style={{ marginLeft: '0.75rem' }}>
              {strings.signOut}
            </button>
          </p>
          <input
            type="text"
            placeholder={strings.displayName}
            value={displayName}
            onInput={(e) => setDisplayName((e.target as HTMLInputElement).value)}
          />
          <textarea
            required
            placeholder={strings.placeholder}
            value={body}
            onInput={(e) => setBody((e.target as HTMLTextAreaElement).value)}
          />
          <button type="submit" class="btn-primary" disabled={submitting}>
            {strings.submit}
          </button>
        </form>
      )}

      {loading ? (
        <p class="comment-notice">{strings.loading}</p>
      ) : comments.length === 0 ? (
        <p class="comment-notice">{strings.empty}</p>
      ) : (
        <ul class="comment-list">
          {comments.map((comment) => (
            <li class="comment-item" key={comment.id}>
              <div class="comment-meta">
                {comment.author_name ?? 'Anonymous'} ·{' '}
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
