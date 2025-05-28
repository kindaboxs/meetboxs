import { Dispatch, SetStateAction } from "react";

import {
	Calculator,
	Calendar,
	CreditCard,
	Settings,
	Smile,
	User,
} from "lucide-react";

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandResponsiveDialog,
	CommandSeparator,
	CommandShortcut,
} from "@/components/ui/command";

interface DashboardCommandProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: DashboardCommandProps) => {
	return (
		<CommandResponsiveDialog open={open} onOpenChange={setOpen}>
			<CommandInput placeholder="Search" />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Suggestions">
					<CommandItem>
						<Calendar />
						<span>Calendar</span>
					</CommandItem>
					<CommandItem>
						<Smile />
						<span>Search Emoji</span>
					</CommandItem>
					<CommandItem>
						<Calculator />
						<span>Calculator</span>
					</CommandItem>
				</CommandGroup>
				<CommandSeparator />
				<CommandGroup heading="Settings">
					<CommandItem>
						<User />
						<span>Profile</span>
						<CommandShortcut>⌘P</CommandShortcut>
					</CommandItem>
					<CommandItem>
						<CreditCard />
						<span>Billing</span>
						<CommandShortcut>⌘B</CommandShortcut>
					</CommandItem>
					<CommandItem>
						<Settings />
						<span>Settings</span>
						<CommandShortcut>⌘S</CommandShortcut>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandResponsiveDialog>
	);
};
