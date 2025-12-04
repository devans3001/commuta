import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "./ui/skeleton";

export function RidersTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="hidden lg:table-cell">
            <Skeleton className="h-5 w-10" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-5 w-32" />
          </TableCell>

          <TableCell className="hidden md:table-cell">
            <Skeleton className="h-5 w-40" />
          </TableCell>

          <TableCell className="hidden lg:table-cell">
            <Skeleton className="h-5 w-24" />
          </TableCell>

          <TableCell className="hidden xl:table-cell">
            <Skeleton className="h-4 w-16" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-5 w-14" />
          </TableCell>

          <TableCell className="hidden lg:table-cell">
            <Skeleton className="h-5 w-20" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-5 w-12" />
          </TableCell>

          <TableCell className="hidden md:table-cell">
            <Skeleton className="h-5 w-10" />
          </TableCell>

          <TableCell className="hidden xl:table-cell">
            <Skeleton className="h-4 w-20" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-6 w-6 rounded-full" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
