import { botttsNeutral, initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface GenerateAvatarProps {
	seed: string;
	className?: string;
	variant: "initials" | "botttsNeutral";
}

export const GenerateAvatar = ({
	seed,
	className,
	variant,
}: GenerateAvatarProps) => {
	let avatar;

	if (variant === "initials") {
		avatar = createAvatar(initials, {
			seed,
			fontWeight: 500,
			fontSize: 42,
		});
	} else {
		avatar = createAvatar(botttsNeutral, {
			seed,
		});
	}

	return (
		<Avatar className={cn(className)}>
			<AvatarImage src={avatar.toDataUri()} alt={seed} />
			<AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
		</Avatar>
	);
};
