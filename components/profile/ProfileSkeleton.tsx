export default function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-32 bg-gray-200 rounded-2xl w-full" />
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-64 h-64 bg-gray-200 rounded-2xl hidden md:block" />
        <div className="flex-1 space-y-4">
          <div className="h-48 bg-gray-200 rounded-2xl w-full" />
          <div className="h-48 bg-gray-200 rounded-2xl w-full" />
        </div>
      </div>
    </div>
  );
}
