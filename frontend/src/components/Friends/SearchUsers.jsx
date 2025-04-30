import UserSearch from "./UserSearch";

export default function SearchUsers() {
  return (
    <div className="bg-[var(--color-card)] text-[var(--color-textPrimary)] rounded-xl shadow p-6 w-full max-w-md mx-auto">
      <UserSearch />
    </div>
  );
}
