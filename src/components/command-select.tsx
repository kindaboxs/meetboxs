import { useState, type ReactNode } from "react";

import { ChevronsUpDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
	CommandResponsiveDialog,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface Props {
	options: Array<{
		id: string;
		value: string;
		children: ReactNode;
	}>;
	onSelect: (value: string) => void;
	onSearch?: (value: string) => void;
	value: string;
	placeholder?: string;
	isSearchable?: boolean;
	className?: string;
}

export const CommandSelect = ({
	options,
	onSelect,
	onSearch,
	value,
	placeholder = "Select an option",
	isSearchable,
	className,
}: Props) => {
	const [open, setOpen] = useState<boolean>(false);

	const selectedOption = options.find((option) => option.id === value);

	return (
		<>
			<Button
				variant="outline"
				type="button"
				className={cn(
					"h-9 justify-between px-2 font-normal",
					!selectedOption && "text-muted-foreground",
					className
				)}
				onClick={() => setOpen(true)}
			>
				<div>{selectedOption?.children ?? placeholder}</div>
				<ChevronsUpDownIcon />
			</Button>
			<CommandResponsiveDialog
				open={open}
				onOpenChange={setOpen}
				shouldFilter={!onSearch}
			>
				<CommandInput placeholder="Search..." onValueChange={onSearch} />
				<CommandList>
					<CommandEmpty>
						<span className="text-muted-foreground text-sm">
							No results found.
						</span>
					</CommandEmpty>
					{options.map((option) => (
						<CommandItem
							key={option.id}
							onSelect={() => {
								onSelect(option.id);
								setOpen(false);
							}}
						>
							{option.children}
						</CommandItem>
					))}
				</CommandList>
			</CommandResponsiveDialog>
		</>
	);
};
