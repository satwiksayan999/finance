import { useAppStore } from '../state/store';

export function RoleSwitcher() {
	const role = useAppStore(s => s.role);
	const setRole = useAppStore(s => s.setRole);
	return (
		<div className="inline-flex items-center gap-2">
			<label htmlFor="role" className="text-sm text-zinc-500">Role</label>
			<select
				id="role"
				className="btn"
				value={role}
				onChange={(e) => setRole(e.target.value as 'viewer' | 'admin')}
			>
				<option value="viewer">Viewer</option>
				<option value="admin">Admin</option>
			</select>
		</div>
	);
}

