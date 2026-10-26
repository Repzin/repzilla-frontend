import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Link,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Dumbbell,
  Fingerprint,
  Home,
  Moon,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  UserPlus,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "./components/ui/button";
import "./App.css";
import "./glass.css";

type Member = {
  id: string;
  name: string;
  phone: string;
  emergency: string;
  paid: boolean;
  time: string;
  plan: string;
};
type Package = {
  id: string;
  name: string;
  months: number;
  price: number;
  members: number;
  published: boolean;
};
type Payment = {
  id: string;
  memberId: string;
  amount: number;
  date: string;
  start: string;
  end: string;
  plan: string;
};
type DayStatus = "paid" | "unpaid" | "absent" | "closed";
const initialMembers: Member[] = [
  {
    id: "1",
    name: "Kasun Perera",
    phone: "077 123 4567",
    emergency: "071 234 5678",
    paid: true,
    time: "06:12 AM",
    plan: "Monthly unlimited",
  },
  {
    id: "2",
    name: "Nethmi Fernando",
    phone: "077 234 5678",
    emergency: "071 234 5678",
    paid: true,
    time: "06:28 AM",
    plan: "Quarterly unlimited",
  },
  {
    id: "3",
    name: "Dilan Silva",
    phone: "077 345 6789",
    emergency: "071 234 5678",
    paid: false,
    time: "06:45 AM",
    plan: "Monthly unlimited",
  },
  {
    id: "4",
    name: "Shenali Jayawardena",
    phone: "077 456 7890",
    emergency: "071 234 5678",
    paid: true,
    time: "07:03 AM",
    plan: "Monthly unlimited",
  },
  {
    id: "5",
    name: "Ravindu Dias",
    phone: "077 567 8901",
    emergency: "071 234 5678",
    paid: false,
    time: "07:16 AM",
    plan: "Monthly unlimited",
  },
  {
    id: "6",
    name: "Amaya Wijesinghe",
    phone: "077 678 9012",
    emergency: "071 234 5678",
    paid: true,
    time: "07:32 AM",
    plan: "Annual unlimited",
  },
];
const initialPackages: Package[] = [
  {
    id: "1",
    name: "Monthly unlimited",
    months: 1,
    price: 4500,
    members: 38,
    published: true,
  },
  {
    id: "2",
    name: "Quarterly unlimited",
    months: 3,
    price: 12000,
    members: 24,
    published: true,
  },
  {
    id: "3",
    name: "Annual unlimited",
    months: 12,
    price: 42000,
    members: 12,
    published: true,
  },
  {
    id: "4",
    name: "Student essentials",
    months: 1,
    price: 3000,
    members: 0,
    published: false,
  },
];
const initialPayments: Payment[] = [
  {
    id: "p1",
    memberId: "1",
    amount: 4500,
    date: "2026-10-01",
    start: "2026-10-01",
    end: "2026-10-31",
    plan: "Monthly unlimited",
  },
  {
    id: "p2",
    memberId: "1",
    amount: 4500,
    date: "2026-09-01",
    start: "2026-09-01",
    end: "2026-09-30",
    plan: "Monthly unlimited",
  },
  {
    id: "p3",
    memberId: "2",
    amount: 12000,
    date: "2026-10-01",
    start: "2026-10-01",
    end: "2026-12-31",
    plan: "Quarterly unlimited",
  },
];
const today = new Date();
today.setHours(12, 0, 0, 0);
const isoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const money = (value: number) =>
  new Intl.NumberFormat("en-LK", { maximumFractionDigits: 0 }).format(value);
const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
const prettyDate = (value: string) =>
  new Date(value + "T12:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
function readSaved<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
function useSaved<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readSaved(key, fallback));
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}
function IconBox({
  icon: Icon,
  className = "",
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <span className={`icon-box ${className}`}>
      <Icon size={21} />
    </span>
  );
}
function SectionTitle({
  title,
  detail,
  children,
}: {
  title: string;
  detail?: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        {detail && <p>{detail}</p>}
      </div>
      {children}
    </div>
  );
}
function Chips({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string; count?: number }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="chips" aria-label="Filter">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={`chip ${value === option.value ? "selected" : ""}`}
        >
          {option.label}
          {option.count !== undefined && <span>{option.count}</span>}
        </button>
      ))}
    </div>
  );
}
function QuickActions() {
  return (
    <div className="quick-actions">
      <Link to="/members/new" className="action-card">
        <IconBox icon={UserPlus} />
        <div>
          <strong>Add member</strong>
        </div>
        <ArrowRight size={18} />
      </Link>
      <Link to="/payments/new" className="action-card payment-action">
        <IconBox icon={Wallet} />
        <div>
          <strong>Add payment</strong>
        </div>
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}
function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="page-heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}
function StatCard({
  icon,
  label,
  value,
  note,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="stat-card">
      <IconBox icon={icon} />
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}
function Dashboard({ members }: { members: Member[] }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  // New registrations are members, but do not have an attendance check-in yet.
  const attendance = members.filter((m) => m.time);
  const shown = attendance.filter(
    (m) =>
      (filter === "all" || (filter === "paid" ? m.paid : !m.paid)) &&
      m.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        eyebrow={today.toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
        title="Quick Actions"
      />
      <QuickActions />
      <section className="section">
        <SectionTitle title="Today’s attendance">
          <span className="live-badge">
            <i /> Live overview
          </span>
        </SectionTitle>
        <div className="attendance-toolbar">
          <Chips
            value={filter}
            onChange={setFilter}
            options={[
              { label: "All", value: "all", count: attendance.length },
              {
                label: "Paid",
                value: "paid",
                count: attendance.filter((m) => m.paid).length,
              },
              {
                label: "Unpaid",
                value: "unpaid",
                count: attendance.filter((m) => !m.paid).length,
              },
            ]}
          />
          <label className="search">
            <Search size={18} />
            <input
              aria-label="Search members"
              placeholder="Search members"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>
        <div className="panel attendance-list">
          <div className="list-header">
            <span>Member</span>
            <span>Membership / check-in</span>
          </div>
          {shown.map((member) => (
            <Link
              className={`attendance-row ${member.paid ? "paid" : "unpaid"}`}
              to={`/members/${member.id}`}
              key={member.id}
            >
              <span className="avatar">{initials(member.name)}</span>
              <div className="member-info">
                <strong>{member.name}</strong>
                <span>{member.plan}</span>
              </div>
              <div className="record-meta">
                <span
                  className={`status-pill ${member.paid ? "paid" : "unpaid"}`}
                >
                  {member.paid ? <Check size={12} /> : <Wallet size={12} />}
                  {member.paid ? "Paid" : "Payment due"}
                </span>
                <time>{member.time}</time>
              </div>
              <ChevronRight size={17} className="row-arrow" />
            </Link>
          ))}
          {!shown.length && (
            <div className="empty-state">
              <Search />
              <h3>No check-ins found</h3>
              <p>Try another name or attendance filter.</p>
            </div>
          )}
          <div className="list-footer"></div>
        </div>
      </section>
      <div className="dashboard-summary">
        <StatCard
          icon={Users}
          label="Checked in today"
          value={String(attendance.length)}
          note=""
        />
        {/* <div className="brand-note"> */}
        {/*   <Sparkles size={24} /> */}
        {/*   <div> */}
        {/*     <strong>Built on consistency.</strong> */}
        {/*     <p>One rep. One day. One stronger you.</p> */}
        {/*   </div> */}
        {/* </div> */}
      </div>
    </>
  );
}
function Actions() {
  return (
    <>
      <PageHeading eyebrow="Add new entities to the gym." title="Add +" />
      <SectionTitle title="Members" />
      <QuickActions />
      <section className="section">
        <SectionTitle title="Your gym" />
        <div className="action-grid">
          <Link to="/packages/new" className="panel large-action">
            <IconBox icon={Dumbbell} />
            <div>
              <h3>Add a package</h3>
            </div>
            <ArrowRight size={20} />
          </Link>
          <div className="panel large-action unavailable">
            <IconBox icon={Users} />
            <div>
              <h3>Add an employee</h3>
            </div>
            <span className="neutral-pill">Coming soon</span>
          </div>
        </div>
      </section>
    </>
  );
}
function Gym({
  packages,
  members,
  payments,
}: {
  packages: Package[];
  members: Member[];
  payments: Payment[];
}) {
  const [filter, setFilter] = useState("published");
  const total = payments
    .filter((p) => p.date.startsWith(isoDate(today).slice(0, 7)))
    .reduce((sum, p) => sum + p.amount, 0);
  return (
    <>
      <PageHeading
        eyebrow="YOUR SPACE TO GROW"
        title="placeholder: Gym name"
        description=""
      />
      <QuickActions />
      <section className="section">
        <SectionTitle title="The bigger picture" />
        <div className="stats-grid">
          <StatCard
            icon={Users}
            label="Active members"
            value={String(members.filter((m) => m.paid).length)}
            note={`${members.length} members in your gym`}
          />
          <StatCard
            icon={Wallet}
            label="This month’s earnings"
            value={`Rs. ${money(total)}`}
            note={today.toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            })}
          />
        </div>
      </section>
      <section className="section">
        <SectionTitle title="Membership packages" detail="">
          <Button asChild variant="secondary">
            <Link to="/packages/new">
              <Plus size={16} /> Add package
            </Link>
          </Button>
        </SectionTitle>
        <Chips
          value={filter}
          onChange={setFilter}
          options={[
            {
              label: "Published",
              value: "published",
              count: packages.filter((p) => p.published).length,
            },
            {
              label: "Drafts",
              value: "draft",
              count: packages.filter((p) => !p.published).length,
            },
          ]}
        />
        <div className="package-grid">
          {packages
            .filter((p) => p.published === (filter === "published"))
            .map((p, i) => (
              <article className="panel package-card" key={p.id}>
                <div className="package-top">
                  <IconBox icon={Dumbbell} />
                  {i === 0 && p.published && (
                    <span className="accent-pill">Popular choice</span>
                  )}
                </div>
                <h3>{p.name}</h3>
                <p>
                  {p.months === 1 ? "1 month" : `${p.months} months`} of making
                  it count
                </p>
                <div className="price">
                  Rs. {money(p.price)}
                  <span> / package</span>
                </div>
                <div className="package-bottom">
                  <Users size={15} /> {p.members} members
                  <span className="neutral-pill">
                    {p.published ? "Published" : "Draft"}
                  </span>
                </div>
              </article>
            ))}
        </div>
      </section>
      <section className="section">
        <SectionTitle title="Your team" detail="" />
        <div className="panel team-list">
          {[
            { name: "Anjana Perera", role: "Gym owner", initials: "AP" },
            { name: "Sahan Rodrigo", role: "Personal trainer", initials: "SR" },
          ].map((e) => (
            <div className="team-row" key={e.name}>
              <span className="avatar">{e.initials}</span>
              <div>
                <strong>{e.name}</strong>
                <span>{e.role}</span>
              </div>
              <span className="status-pill paid">Active</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
const statusLabels: Record<DayStatus, string> = {
  paid: "Attended · paid",
  unpaid: "Attended · unpaid",
  absent: "Not attended",
  closed: "Gym closed",
};
function MemberAttendance({
  members,
  payments,
}: {
  members: Member[];
  payments: Payment[];
}) {
  const { id } = useParams();
  const member = members.find((m) => m.id === id);
  const [month, setMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<number | null>(null);
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const offset = (month.getDay() + 6) % 7;
  const seed = [...(id || "")].reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0,
  );
  const statusFor = (day: number): DayStatus => {
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    return date.getDay() === 0
      ? "closed"
      : (day + seed) % 5 === 0
        ? "absent"
        : (day + seed) % 7 < 2
          ? "unpaid"
          : "paid";
  };
  const recorded = Array.from({ length: days }, (_, i) => i + 1).filter(
    (day) => new Date(month.getFullYear(), month.getMonth(), day, 12) <= today,
  );
  if (!member) return <NotFound />;
  const history = payments.filter((p) => p.memberId === id);
  return (
    <>
      <Link className="back-link" to="/">
        <ArrowLeft size={17} /> Back to attendance
      </Link>
      <div className="member-heading">
        <span className="avatar large">{initials(member.name)}</span>
        <div>
          <p className="eyebrow">MEMBER ATTENDANCE</p>
          <h1>{member.name}</h1>
          <p>
            {member.phone} <span className="text-divider">·</span> {member.plan}
          </p>
        </div>
      </div>
      <div className="member-stats">
        <div>
          <strong>
            {
              recorded.filter((d) => ["paid", "unpaid"].includes(statusFor(d)))
                .length
            }
          </strong>
          <span>Days attended</span>
        </div>
        <div>
          <strong>
            {recorded.filter((d) => statusFor(d) === "unpaid").length}
          </strong>
          <span>Unpaid visits</span>
        </div>
        <div>
          <strong>{member.paid ? "Active" : "Due"}</strong>
          <span>Membership</span>
        </div>
      </div>
      <section className="section">
        <SectionTitle
          title="Attendance, on the calendar"
          detail="Select a day to see its attendance status."
        />
        <Chips
          value={filter}
          onChange={setFilter}
          options={[
            { label: "All days", value: "all" },
            ...Object.entries(statusLabels).map(([value, label]) => ({
              value,
              label,
            })),
          ]}
        />
        <div className="panel calendar-panel">
          <div className="calendar-toolbar">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Previous month"
              onClick={() => {
                setMonth(
                  new Date(month.getFullYear(), month.getMonth() - 1, 1),
                );
                setSelected(null);
              }}
            >
              <ChevronLeft size={20} />
            </Button>
            <h3>
              {month.toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Next month"
              onClick={() => {
                setMonth(
                  new Date(month.getFullYear(), month.getMonth() + 1, 1),
                );
                setSelected(null);
              }}
            >
              <ChevronRight size={20} />
            </Button>
          </div>
          <div className="calendar-grid">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span className="weekday" key={d}>
                {d}
              </span>
            ))}
            {Array.from({ length: offset }, (_, i) => (
              <span key={`blank-${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const day = i + 1;
              const future =
                new Date(month.getFullYear(), month.getMonth(), day, 12) >
                today;
              const status = statusFor(day);
              return (
                <button
                  key={day}
                  disabled={future}
                  aria-label={`${day} ${month.toLocaleDateString("en-GB", { month: "long" })}: ${future ? "Upcoming" : statusLabels[status]}`}
                  aria-pressed={selected === day}
                  className={`calendar-day ${future ? "future" : status} ${!future && filter !== "all" && filter !== status ? "dimmed" : ""} ${selected === day ? "chosen" : ""}`}
                  onClick={() => setSelected(day)}
                >
                  <span>{day}</span>
                  {!future && (
                    <span className="day-mark">
                      {status === "paid" ? (
                        <CheckCheck size={15} />
                      ) : status === "unpaid" ? (
                        <Wallet size={14} />
                      ) : status === "closed" ? (
                        <X size={14} />
                      ) : (
                        <span>—</span>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="calendar-legend">
            {Object.entries(statusLabels).map(([status, label]) => (
              <span key={status}>
                <i className={status} />
                {label}
              </span>
            ))}
          </div>
          {selected && (
            <div className={`day-detail ${statusFor(selected)}`}>
              <strong>
                {selected}{" "}
                {month.toLocaleDateString("en-GB", { month: "long" })}
              </strong>
              <span>{statusLabels[statusFor(selected)]}</span>
            </div>
          )}
        </div>
        <p className="demo-note">
          Illustrative attendance history · live device records can be connected
          later.
        </p>
      </section>
      <section className="section">
        <SectionTitle
          title="Payment history"
          detail="A clear view of their membership payments."
        >
          <Button asChild variant="secondary">
            <Link to={`/payments/new?member=${member.id}`}>
              <Plus size={16} /> Payment
            </Link>
          </Button>
        </SectionTitle>
        <div className="panel">
          {history.length ? (
            history.map((p) => (
              <div className="history-row" key={p.id}>
                <IconBox icon={ArrowDownLeft} className="green-icon" />
                <div>
                  <strong>{p.plan}</strong>
                  <span>{prettyDate(p.date)}</span>
                </div>
                <div className="history-amount">
                  <strong>Rs. {money(p.amount)}</strong>
                  <span className="status-pill paid">Paid</span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <Wallet />
              <h3>No payments yet</h3>
              <p>Record a payment to start their membership history.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
function FlowLayout({
  title,
  subtitle,
  children,
  step,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  step?: number;
}) {
  const navigate = useNavigate();
  return (
    <div className="flow-layout">
      <button className="back-link" onClick={() => navigate(-1)}>
        <ArrowLeft size={17} /> Go back
      </button>
      {step && (
        <div className="stepper" aria-label={`Step ${step} of 3`}>
          {["Member details", "Biometrics", "All set"].map((label, index) => (
            <div
              className={`step ${index + 1 <= step ? "active" : ""}`}
              key={label}
            >
              <span>{index + 1 < step ? <Check size={16} /> : index + 1}</span>
              <small>{label}</small>
            </div>
          ))}
        </div>
      )}
      <PageHeading title={title} description={subtitle} />
      {children}
    </div>
  );
}
function Success({
  title,
  message,
  children,
}: {
  title: string;
  message: string;
  children?: ReactNode;
}) {
  return (
    <div className="panel success-panel">
      <div className="success-icon">
        <Check size={32} />
      </div>
      <h2>{title}</h2>
      <p>{message}</p>
      {children}
      <Button asChild>
        <Link to="/">
          Back to home <ArrowRight size={17} />
        </Link>
      </Button>
    </div>
  );
}
function AddMember({ onAdd }: { onAdd: (member: Member) => void }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emergency, setEmergency] = useState("");
  const [scanned, setScanned] = useState(false);
  const [newId] = useState(() => crypto.randomUUID());
  const finish = () => {
    onAdd({
      id: newId,
      name: name.trim(),
      phone,
      emergency,
      paid: false,
      time: "",
      plan: "No package yet",
    });
    setStep(3);
  };
  return (
    <FlowLayout
      step={step}
      title={
        step === 1
          ? "Make room for a new member."
          : step === 2
            ? "A familiar face. A unique print."
            : "Their next chapter starts here."
      }
      subtitle={
        step === 1
          ? "A few details to welcome them to the community."
          : step === 2
            ? "Set up an effortless check-in experience."
            : "One more person on the path to stronger."
      }
    >
      {step === 1 ? (
        <form
          className="panel form-panel"
          onSubmit={(e) => {
            e.preventDefault();
            setStep(2);
          }}
        >
          <IconBox icon={UserPlus} />
          <Field label="Full name">
            <input
              required
              autoComplete="name"
              placeholder="e.g. Kasun Perera"
              value={name}
              onChange={(e) => setName(e.target.value)}
              pattern=".*\S.*"
              maxLength={80}
            />
          </Field>
          <Field label="Phone number">
            <input
              required
              type="tel"
              autoComplete="tel"
              pattern="[+]?[0-9 ]{9,18}"
              placeholder="077 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Field>
          <Field
            label="Emergency contact number"
            hint="Someone we can reach if they need a hand."
          >
            <input
              required
              type="tel"
              pattern="[+]?[0-9 ]{9,18}"
              placeholder="071 234 5678"
              value={emergency}
              onChange={(e) => setEmergency(e.target.value)}
            />
          </Field>
          <div className="form-footer">
            <span>Step 1 of 3</span>
            <Button type="submit">
              Save & continue <ArrowRight size={17} />
            </Button>
          </div>
        </form>
      ) : step === 2 ? (
        <div className="panel form-panel">
          <div className="member-preview">
            <span className="avatar">{initials(name)}</span>
            <div>
              <strong>{name}</strong>
              <span>{phone}</span>
            </div>
            <Button variant="ghost" onClick={() => setStep(1)}>
              Edit
            </Button>
          </div>
          <div className={`biometric ${scanned ? "complete" : ""}`}>
            <Fingerprint size={64} strokeWidth={1.3} />
            <h3>
              {scanned
                ? "Demo fingerprint captured"
                : "Let’s get them checked in"}
            </h3>
            <p>
              {scanned
                ? "The sample biometric profile is ready to confirm."
                : "In the connected app, the member will place a finger on your gym’s biometric reader."}
            </p>
            <span className="neutral-pill">Demo mode · no device required</span>
          </div>
          {!scanned && (
            <Button variant="secondary" onClick={() => setScanned(true)}>
              Simulate fingerprint scan <Fingerprint size={17} />
            </Button>
          )}
          <div className="form-footer">
            <Button variant="ghost" onClick={finish}>
              Skip for now
            </Button>
            <Button disabled={!scanned} onClick={finish}>
              Confirm member <Check size={17} />
            </Button>
          </div>
        </div>
      ) : (
        <Success
          title="Welcome to the community!"
          message={`${name} has been added. You can now add their first membership payment.`}
        >
          <Button asChild variant="secondary">
            <Link to={`/payments/new?member=${newId}`}>
              Add a membership payment <Wallet size={17} />
            </Link>
          </Button>
        </Success>
      )}
    </FlowLayout>
  );
}
function AddPackage({ onAdd }: { onAdd: (pack: Package) => void }) {
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");
  const [months, setMonths] = useState("1");
  const [price, setPrice] = useState("");
  const [publish, setPublish] = useState(true);
  return (
    <FlowLayout title={"Add new membership package."} subtitle={""}>
      {done ? (
        <Success
          title="Package created"
          message={`${name} has been ${publish ? "published and is ready for payments" : "saved as a draft"}.`}
        >
          <Button asChild variant="secondary">
            <Link to="/gym">View packages</Link>
          </Button>
        </Success>
      ) : (
        <form
          className="panel form-panel"
          onSubmit={(e) => {
            e.preventDefault();
            onAdd({
              id: crypto.randomUUID(),
              name: name.trim(),
              months: Number(months),
              price: Number(price),
              members: 0,
              published: publish,
            });
            setDone(true);
          }}
        >
          <IconBox icon={Dumbbell} />
          <Field label="Package name">
            <input
              required
              pattern=".*\S.*"
              maxLength={80}
              placeholder="e.g. Monthly unlimited"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <div className="form-grid">
            <Field label="Duration (months)">
              <input
                type="number"
                required
                min="1"
                max="60"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
              />
            </Field>
            <Field label="Price (LKR)">
              <input
                type="number"
                required
                min="1"
                max="1000000"
                step="0.01"
                placeholder="4,500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Field>
          </div>
          <div className="info-banner">
            <Users size={18} />
            <p>Member counts update as members purchase this package.</p>
          </div>
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
            />
            <div>
              <strong>Publish this package</strong>
              <span>Make it available when adding payments.</span>
            </div>
          </label>
          <div className="form-footer">
            <Link to="/gym" className="text-link">
              Cancel
            </Link>
            <Button type="submit">
              {publish ? "Create package" : "Save draft"}{" "}
              <ArrowRight size={17} />
            </Button>
          </div>
        </form>
      )}
    </FlowLayout>
  );
}
function AddPayment({
  packages,
  members,
  onAdd,
}: {
  packages: Package[];
  members: Member[];
  onAdd: (payment: Payment) => void;
}) {
  const [memberId, setMemberId] = useState(
    new URLSearchParams(window.location.search).get("member") || "",
  );
  const [packageId, setPackageId] = useState("");
  const [query, setQuery] = useState("");
  const [start, setStart] = useState(isoDate(today));
  const [done, setDone] = useState(false);
  const pack = packages.find((p) => p.id === packageId);
  const member = members.find((m) => m.id === memberId);
  const endDate = new Date(start + "T12:00:00");
  if (pack && !Number.isNaN(endDate.getTime())) {
    const targetMonth = endDate.getMonth() + pack.months;
    const day = endDate.getDate();
    endDate.setDate(1);
    endDate.setMonth(targetMonth);
    const last = new Date(
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      0,
    ).getDate();
    endDate.setDate(Math.min(day, last));
    endDate.setDate(endDate.getDate() - 1);
  }
  const end = Number.isNaN(endDate.getTime()) ? "" : isoDate(endDate);
  return (
    <FlowLayout
      title={"Add payment."}
      subtitle={
        done ? "Payment recorded." : "Add a membership and other payments"
      }
    >
      {done ? (
        <Success
          title="Payment recorded"
          message={`${member?.name}’s ${pack?.name.toLowerCase()} membership is active. Rs. ${money(pack?.price || 0)} received.`}
        >
          <Button asChild variant="secondary">
            <Link to={`/members/${memberId}`}>View member attendance</Link>
          </Button>
        </Success>
      ) : (
        <form
          className="panel form-panel"
          onSubmit={(e) => {
            e.preventDefault();
            if (!pack || !member) return;
            onAdd({
              id: crypto.randomUUID(),
              memberId,
              amount: pack.price,
              date: isoDate(today),
              start,
              end,
              plan: pack.name,
            });
            setDone(true);
          }}
        >
          <IconBox icon={Wallet} />
          <Field label="Membership package">
            <select
              required
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
            >
              <option value="" disabled>
                Select a package
              </option>
              {packages
                .filter((p) => p.published)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · Rs. {money(p.price)}
                  </option>
                ))}
            </select>
          </Field>
          {!packages.some((p) => p.published) && (
            <Link className="text-link" to="/packages/new">
              Create a package first
            </Link>
          )}
          {pack && (
            <div className="info-banner">
              <Dumbbell size={20} />
              <p>
                <strong>{pack.name}</strong>
                <br />
                {pack.months} {pack.months === 1 ? "month" : "months"} · Rs.{" "}
                {money(pack.price)}
              </p>
            </div>
          )}
          <Field label="Find a member">
            <div className="search field-search">
              <Search size={18} />
              <input
                placeholder="Search by name or phone"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </Field>
          <Field label="Member">
            <select
              required
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            >
              <option value="" disabled>
                Select a member
              </option>
              {members
                .filter(
                  (m) =>
                    m.id === memberId ||
                    `${m.name} ${m.phone}`
                      .toLowerCase()
                      .includes(query.toLowerCase()),
                )
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} · {m.phone}
                  </option>
                ))}
            </select>
          </Field>
          {member && (
            <div className="member-preview">
              <span className="avatar">{initials(member.name)}</span>
              <div>
                <strong>{member.name}</strong>
                <span>{member.phone}</span>
              </div>
              <CircleCheck size={20} className="accent-text" />
            </div>
          )}
          <div className="form-grid">
            <Field label="Start date">
              <input
                type="date"
                required
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </Field>
            <Field label="End date" hint="Calculated from package duration.">
              <input
                type="date"
                aria-label="End date"
                readOnly
                value={pack ? end : ""}
              />
            </Field>
          </div>
          <div className="payment-total">
            <span>
              Total payment<small>Membership fee · LKR</small>
            </span>
            <strong>Rs. {money(pack?.price || 0)}</strong>
          </div>
          <div className="form-footer">
            <span>
              <ShieldCheck size={14} /> Record a received payment
            </span>
            <Button disabled={!pack || !member} type="submit">
              Add payment <Check size={17} />
            </Button>
          </div>
        </form>
      )}
    </FlowLayout>
  );
}
function NotFound() {
  return (
    <div className="empty-state">
      <Dumbbell />
      <h1>Nothing here just yet.</h1>
      <p>This page or member could not be found.</p>
      <Button asChild>
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  );
}
function ProfileDialog({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);
  return (
    <dialog
      ref={dialog}
      className="profile-modal"
      aria-labelledby="profile-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section className="profile-dialog panel">
        <Button
          autoFocus
          variant="ghost"
          size="icon"
          aria-label="Close profile"
          onClick={onClose}
        >
          <X size={20} />
        </Button>
        <span className="avatar large">AP</span>
        <h2 id="profile-title">Anjana Perera</h2>
        <p>Gym owner · Repzin demo</p>
        <Button onClick={onClose}>Got it</Button>
      </section>
    </dialog>
  );
}
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
function AppShell() {
  const [members, setMembers] = useSaved("repzin-members-v1", initialMembers);
  const [packages, setPackages] = useSaved(
    "repzin-packages-v1",
    initialPackages,
  );
  const [payments, setPayments] = useSaved(
    "repzin-payments-v1",
    initialPayments,
  );
  const [dark, setDark] = useSaved(
    "repzin-dark",
    window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const [profile, setProfile] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);
  function addPayment(payment: Payment) {
    setPayments((p) => [payment, ...p]);
    setMembers((current) =>
      current.map((m) =>
        m.id === payment.memberId
          ? {
              ...m,
              paid:
                payment.start <= isoDate(today) &&
                payment.end >= isoDate(today),
              plan: payment.plan,
            }
          : m,
      ),
    );
    const previous = members.find((m) => m.id === payment.memberId)?.plan;
    setPackages((current) =>
      current.map((p) => ({
        ...p,
        members: Math.max(
          0,
          p.members +
            (p.name === payment.plan && previous !== payment.plan ? 1 : 0) -
            (p.name === previous && previous !== payment.plan ? 1 : 0),
        ),
      })),
    );
  }
  return (
    <>
      <ScrollToTop />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="app-header">
        <div className="header-inner">
          <Link to="/" className="brand" aria-label="Repzin home">
            <img
              className="brand-logo"
              src="/repzin-logo.png"
              alt="Repzin"
              width="96"
              height="64"
            />
          </Link>
          <div className="header-right">
            <span className="gym-label">
              <span />
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              onClick={() => setDark(!dark)}
            >
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="View your profile"
              onClick={() => setProfile(true)}
            >
              <span className="profile-avatar">AP</span>
            </Button>
          </div>
        </div>
      </header>
      <main id="main" className="main-container">
        <Routes>
          <Route path="/" element={<Dashboard members={members} />} />
          <Route path="/add" element={<Actions />} />
          <Route
            path="/gym"
            element={
              <Gym packages={packages} members={members} payments={payments} />
            }
          />
          <Route
            path="/members/new"
            element={
              <AddMember
                onAdd={(member) =>
                  setMembers((current) => [...current, member])
                }
              />
            }
          />
          <Route
            path="/members/:id"
            element={<MemberAttendance members={members} payments={payments} />}
          />
          <Route
            path="/packages/new"
            element={
              <AddPackage
                onAdd={(pack) => setPackages((current) => [...current, pack])}
              />
            }
          />
          <Route
            path="/payments/new"
            element={
              <AddPayment
                packages={packages}
                members={members}
                onAdd={addPayment}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <footer className="page-footer">
          <span>REPZIN</span>
        </footer>
      </main>
      <nav className="bottom-nav" aria-label="Main navigation">
        <NavLink to="/" end>
          <Home size={22} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/add" className="add-nav">
          <span className="plus-icon">
            <Plus size={24} />
          </span>
          <span>Add new</span>
        </NavLink>
        <NavLink to="/gym">
          <Dumbbell size={23} />
          <span>Your gym</span>
        </NavLink>
      </nav>
      {profile && <ProfileDialog onClose={() => setProfile(false)} />}
    </>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
