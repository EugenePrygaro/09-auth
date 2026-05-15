import css from "./SidebarNotes.module.css";
import Link from "next/link";
const NotesSidebar = async () => {
  const categories = [
    { id: "1", name: "Work" },
    { id: "2", name: "Personal" },
    { id: "3", name: "Meeting" },
    { id: "4", name: "Shopping" },
    { id: "5", name: "Todo" },
  ];

  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        <Link href="/notes/action/create" className={css.menuLink}>
          Create note
        </Link>
      </li>
      <li className={css.menuItem}>
        <Link href={`/notes/filter/all`} className={css.menuLink}>
          All notes
        </Link>
      </li>
      {categories.map((category) => (
        <li key={category.id} className={css.menuItem}>
          <Link
            href={`/notes/filter/${category.name}`}
            className={css.menuLink}
          >
            {category.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NotesSidebar;
