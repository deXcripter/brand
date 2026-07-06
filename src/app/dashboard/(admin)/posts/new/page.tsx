import PostEditor from "@/components/dashboard/post-editor";

export default function NewPostPage() {
  return (
    <>
      <header className="dashboard-header">
        <div>
          <p className="eyebrow mono">// blog</p>
          <h1 className="dashboard-header__title">New post</h1>
        </div>
      </header>
      <PostEditor mode="create" />
    </>
  );
}
