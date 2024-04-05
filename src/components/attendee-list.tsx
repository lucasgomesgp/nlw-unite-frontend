import "dayjs/locale/pt-br";

import { ChangeEvent, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    MoreHorizontal,
    Search,
} from "lucide-react";

import { IconButton } from "./icon-button";
import { Table } from "./table/table";
import { TableCell } from "./table/table-cell";
import { TableHeader } from "./table/table-header";
import { TableRow } from "./table/table-row";
import { attendees } from "../data/attendees";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

export function AttendeeList() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(attendees.length / 10);

    function onSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value);
    }
    function goToNextPage() {
        setPage(page + 1);
    }
    function goToPreviousPage() {
        setPage(page - 1);
    }
    function goToFirstPage() {
        setPage(1);
    }
    function goToLastPage() {
        setPage(totalPages);
    }
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">Participants</h1>
                <div className="flex w-72 items-center gap-3 rounded-lg border border-white/10 px-3 py-1.5 text-sm">
                    <Search className="size-4 text-emerald-300" />
                    <input
                        value={search}
                        className="flex-1 border-0 bg-transparent p-0 text-sm outline-none"
                        placeholder="Buscar participante..."
                        onChange={onSearchInputChange}
                    />
                </div>
            </div>
            <Table>
                <thead>
                    <tr className="border-b border-white/10">
                        <th
                            style={{ width: 64 }}
                            className="px-4 py-3 text-left text-sm font-semibold"
                        >
                            <input
                                type="checkbox"
                                className="size-4 rounded border border-white/10 bg-black/20 checked:bg-orange-400"
                            />
                        </th>
                        <TableHeader>Código</TableHeader>
                        <TableHeader>Participante</TableHeader>
                        <TableHeader>Data da inscrição</TableHeader>
                        <TableHeader>Data do check-in</TableHeader>
                        <TableHeader
                            style={{ width: 64 }}
                            className="px-4 py-3 text-left text-sm font-semibold"
                        />
                    </tr>
                </thead>
                <tbody>
                    {attendees
                        .slice((page - 1) * 10, (page + 1) * 10)
                        .map((attendee) => (
                            <TableRow key={attendee.id}>
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        className="checked:bg-orange-400"
                                    />
                                </TableCell>
                                <TableCell>{attendee.id}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1 font-semibold text-white">
                                        <span>{attendee.name}</span>
                                        <span>{attendee.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {dayjs().to(attendee.createdAt)}
                                </TableCell>
                                <TableCell>
                                    {dayjs().to(attendee.checkedInAt)}
                                </TableCell>
                                <TableCell>
                                    <IconButton transparent>
                                        <MoreHorizontal className="size-4" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                </tbody>
                <tfoot>
                    <tr>
                        <TableCell colSpan={3}>
                            Mostrando 10 de {attendees.length} itens
                        </TableCell>
                        <TableCell className="text-right" colSpan={3}>
                            <div className="inline-flex items-center gap-8">
                                <span>
                                    Página {page} de {totalPages}
                                </span>
                                <div className="flex gap-1.5">
                                    <IconButton
                                        onClick={goToFirstPage}
                                        disabled={page === 1}
                                    >
                                        <ChevronsLeft className="size-4" />
                                    </IconButton>
                                    <IconButton
                                        onClick={goToPreviousPage}
                                        disabled={page === 1}
                                    >
                                        <ChevronLeft className="size-4" />
                                    </IconButton>
                                    <IconButton
                                        onClick={goToNextPage}
                                        disabled={page === totalPages}
                                    >
                                        <ChevronRight className="size-4" />
                                    </IconButton>
                                    <IconButton
                                        onClick={goToLastPage}
                                        disabled={page === totalPages}
                                    >
                                        <ChevronsRight className="size-4" />
                                    </IconButton>
                                </div>
                            </div>
                        </TableCell>
                    </tr>
                </tfoot>
            </Table>
        </div>
    );
}
