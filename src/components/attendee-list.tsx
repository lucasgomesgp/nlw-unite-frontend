import "dayjs/locale/pt-br";

import { ChangeEvent, useEffect, useState } from "react";
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
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

interface Attendee {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    checkedInAt: string | null;
}

export function AttendeeList() {
    const [search, setSearch] = useState(() => {
        const url = new URL(window.location.toString());
        if (url.searchParams.has("search")) {
            return url.searchParams.get("search") ?? "";
        }
        return "";
    });

    const [page, setPage] = useState(() => {
        const url = new URL(window.location.toString());
        if (url.searchParams.has("page")) {
            return Number(url.searchParams.get("page"));
        }
        return 1;
    });
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [total, setTotal] = useState(0);

    const totalPages = Math.ceil(total / 10);

    function goToNextPage() {
        setCurrentPage(page + 1);
    }

    function goToPreviousPage() {
        setCurrentPage(page - 1);
    }

    function goToFirstPage() {
        setCurrentPage(1);
    }

    function goToLastPage() {
        setCurrentPage(totalPages);
    }

    function setCurrentPage(page: number) {
        const url = new URL(window.location.toString());
        url.searchParams.set("page", String(page));
        window.history.pushState({}, "", url);
        setPage(page);
    }

    function setCurrentSearch(search: string) {
        const url = new URL(window.location.toString());
        url.searchParams.set("search", String(search));
        window.history.pushState({}, "", url);
        setSearch(search);
    }

    function onSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
        setCurrentSearch(event.target.value);
        setCurrentPage(1);
    }
    useEffect(() => {
        const url = new URL(
            "http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees"
        );
        url.searchParams.set("page", String(page - 1));

        if (search.length > 0) {
            url.searchParams.set("query", search);
        }

        fetch(url)
            .then(async (response) => await response.json())
            .then((data) => {
                setAttendees(data.attendees);
                setTotal(data.total);
            });
    }, [page, search]);
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">Participants</h1>
                <div className="flex w-72 items-center gap-3 rounded-lg border border-white/10 px-3 py-1.5 text-sm">
                    <Search className="size-4 text-emerald-300" />
                    <input
                        value={search}
                        className="flex-1 border-0 bg-transparent p-0 text-sm outline-none focus:ring-0"
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
                    {attendees.map((attendee) => (
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
                                {attendee.checkedInAt === null ? (
                                    <span className="text-zinc-500">
                                        Não fez check-in
                                    </span>
                                ) : (
                                    dayjs().to(attendee.checkedInAt)
                                )}
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
                            Mostrando {attendees.length} de {total} itens
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
