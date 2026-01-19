export default function AboutPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">About GamScholar</h1>
      <p className="max-w-3xl text-zinc-600 dark:text-zinc-400">
        GamScholar connects Gambian students with scholarship donors, with admin
        moderation to keep listings trustworthy.
      </p>
      <ul className="list-disc space-y-2 pl-5 text-zinc-600 dark:text-zinc-400">
        <li>
          Students can discover, save, and apply step-by-step (with autosave).
        </li>
        <li>Donors can create and manage scholarships and view applicants.</li>
        <li>
          Admins can moderate scholarships (publish, unpublish, restrict, edit,
          delete).
        </li>
      </ul>
    </div>
  );
}
