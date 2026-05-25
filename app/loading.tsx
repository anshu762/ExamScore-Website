export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F3226]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FDFCF9]/20 border-t-[#C9A84C]" />
        <p className="font-serif text-sm italic text-[#FDFCF9]/40">Loading ExamScore...</p>
      </div>
    </div>
  );
}
