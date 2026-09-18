"""
Draft follow-up messages for inbound remodeling leads.

Reads the leads exported from the website's quote form and prints a short SMS
and email draft for each one, so whoever answers the phone can respond in
minutes instead of letting a lead sit overnight. Speed of first reply is the
single biggest lever on whether a homeowner books with you or with the next
contractor on their list.

Everything here is deterministic template selection. There is no API call, no
key, and no network access, so the tool costs nothing to run and behaves the
same every time. That is deliberate: the live demo must work at zero ongoing
spend.

Usage:
    python tools/lead_followup_drafter.py
    python tools/lead_followup_drafter.py --csv path/to/leads.csv
    python tools/lead_followup_drafter.py --only-urgent

Style note: this module follows the Appendix A Python conventions. Class
variables use snake_case, constants use ALL_CAPS with typing.Final, internal
names carry a single leading underscore, every module, class, and function
carries a multi-line docstring, parameters and returns are annotated, each
class defines __str__, and execution is guarded by if __name__ == '__main__'.
"""

from __future__ import annotations

import argparse
import csv
import sys
from datetime import datetime
from pathlib import Path
from typing import Final

# Default location of the exported leads, relative to this file, so the tool
# runs correctly from the repository root or from inside tools/.
DEFAULT_CSV_PATH: Final[Path] = Path(__file__).resolve().parent / "sample_leads.csv"

# Business identity used in the drafts. Change these when white-labeling the
# demo for a real contractor.
COMPANY_NAME: Final[str] = "Ridgeview Remodeling"
COMPANY_OWNER: Final[str] = "Marcus"
COMPANY_PHONE: Final[str] = "(619) 555-0180"

# Timeline values that mean the homeowner wants to hear back today rather than
# whenever someone gets to it. Compared case-insensitively.
URGENT_TIMELINES: Final[frozenset[str]] = frozenset({"asap", "emergency", "immediately"})

# Opening line per project type. Naming the specific job in the first sentence
# is what makes the reply read as written by a person rather than generated.
PROJECT_OPENERS: Final[dict[str, str]] = {
    "kitchen": "Thanks for the details on the kitchen.",
    "bathroom": "Thanks for the details on the bathroom.",
    "adu": "Thanks for reaching out about the ADU.",
    "whole home": "Thanks for reaching out about the whole-home remodel.",
}

# Fallback opener when the project type is missing or unrecognized.
GENERIC_OPENER: Final[str] = "Thanks for reaching out about your project."

# How soon to promise a visit, per timeline bucket. The promise has to be one
# the business can actually keep, so these are deliberately conservative.
VISIT_OFFER: Final[dict[str, str]] = {
    "asap": "I can come take a look tomorrow if that works.",
    "1-3 months": "I can come take a look this week or next.",
    "3-6 months": "Happy to come walk the space whenever you are ready.",
    "6-12 months": "Happy to come walk the space and give you a number to plan around.",
    "just planning": "Happy to give you a ballpark now and a firm number closer to the time.",
}

# Fallback visit offer when the timeline is missing or unrecognized.
GENERIC_VISIT_OFFER: Final[str] = "Happy to come take a look whenever suits you."

# An SMS longer than this gets split by carriers into multiple messages, which
# looks careless. Drafts are checked against it and flagged.
SMS_CHARACTER_LIMIT: Final[int] = 160


class Lead:
    """
    One inbound quote request from the website form.

    Attributes:
        _name (str): Homeowner's name as submitted.
        _phone (str): Contact phone number.
        _email (str): Contact email, which may be empty since it is optional.
        _project_type (str): Kitchen, Bathroom, ADU, or Whole home.
        _city (str): City or ZIP the homeowner entered.
        _timeline (str): How soon they want the work done.
        _details (str): Free-text description of the project.
        _source (str): How they found the business.
        _submitted_at (str): ISO timestamp the form was submitted.
    """

    def __init__(
        self,
        name: str,
        phone: str,
        email: str,
        project_type: str,
        city: str,
        timeline: str,
        details: str,
        source: str,
        submitted_at: str,
    ) -> None:
        """
        Initialize a lead from one row of the export.

        Parameters:
            name (str): Homeowner's name.
            phone (str): Contact phone number.
            email (str): Contact email, may be empty.
            project_type (str): The kind of work requested.
            city (str): City or ZIP.
            timeline (str): Requested timeline.
            details (str): Free-text project description.
            source (str): How they found the business.
            submitted_at (str): ISO timestamp of submission.
        """
        self._name: str = name.strip()
        self._phone: str = phone.strip()
        self._email: str = email.strip()
        self._project_type: str = project_type.strip()
        self._city: str = city.strip()
        self._timeline: str = timeline.strip()
        self._details: str = details.strip()
        self._source: str = source.strip()
        self._submitted_at: str = submitted_at.strip()

    @classmethod
    def from_row(cls, row: dict[str, str]) -> "Lead":
        """
        Build a Lead from one parsed CSV row.

        Missing columns become empty strings rather than raising, so a partial
        export still produces usable drafts instead of stopping the run.

        Parameters:
            row (dict[str, str]): One row keyed by CSV header.

        Returns:
            Lead: The constructed lead.
        """
        return cls(
            name=row.get("name", ""),
            phone=row.get("phone", ""),
            email=row.get("email", ""),
            project_type=row.get("project_type", ""),
            city=row.get("city", ""),
            timeline=row.get("timeline", ""),
            details=row.get("details", ""),
            source=row.get("source", ""),
            submitted_at=row.get("submitted_at", ""),
        )

    @property
    def name(self) -> str:
        """
        Get the homeowner's full name as submitted.

        Returns:
            str: The name, or "there" when the field was left empty, so a
                greeting never reads "Hi ,".
        """
        return self._name or "there"

    @property
    def first_name(self) -> str:
        """
        Get just the homeowner's first name, for the greeting.

        Returns:
            str: The first whitespace-separated token of the name.
        """
        return self.name.split()[0]

    @property
    def phone(self) -> str:
        """
        Get the contact phone number.

        Returns:
            str: The phone number as submitted.
        """
        return self._phone

    @property
    def email(self) -> str:
        """
        Get the contact email address.

        Returns:
            str: The email, which may be empty since the field is optional.
        """
        return self._email

    @property
    def project_type(self) -> str:
        """
        Get the requested project type.

        Returns:
            str: The project type, or "Project" when not supplied.
        """
        return self._project_type or "Project"

    @property
    def city(self) -> str:
        """
        Get the city or ZIP the homeowner entered.

        Returns:
            str: The city or ZIP.
        """
        return self._city

    @property
    def timeline(self) -> str:
        """
        Get the requested timeline.

        Returns:
            str: The timeline as submitted.
        """
        return self._timeline

    @property
    def details(self) -> str:
        """
        Get the free-text project description.

        Returns:
            str: The details as submitted.
        """
        return self._details

    @property
    def source(self) -> str:
        """
        Get how the homeowner found the business.

        Returns:
            str: The source, or "Unknown" when not supplied.
        """
        return self._source or "Unknown"

    @property
    def is_urgent(self) -> bool:
        """
        Report whether this lead needs a reply today.

        Returns:
            bool: True when the timeline is one of URGENT_TIMELINES.
        """
        return self._timeline.strip().lower() in URGENT_TIMELINES

    @property
    def submitted_display(self) -> str:
        """
        Get the submission time formatted for reading.

        Falls back to the raw string when the timestamp cannot be parsed, so a
        malformed export still prints something useful.

        Returns:
            str: A readable timestamp such as "Mon Sep 14, 9:12 AM".
        """
        try:
            parsed = datetime.fromisoformat(self._submitted_at)
        except ValueError:
            return self._submitted_at or "unknown time"
        return parsed.strftime("%a %b %d, %-I:%M %p")

    def __str__(self) -> str:
        """
        Return a readable one-line representation of the lead.

        Returns:
            str: Name, project type, city, and whether it is urgent.
        """
        urgency = "URGENT" if self.is_urgent else self.timeline or "no timeline"
        return f"Lead({self.name}, {self.project_type}, {self.city}, {urgency})"


class FollowUpDrafter:
    """
    Turn a lead into ready-to-send SMS and email follow-up drafts.

    The templates are deterministic. The same lead always produces the same
    draft, which means the output can be reviewed and edited once and then
    trusted, and the tool needs no API key to run.

    Attributes:
        _company_name (str): Business name used in the drafts.
        _owner_name (str): Person the messages are signed by.
        _company_phone (str): Callback number included in the email.
    """

    def __init__(
        self,
        company_name: str = COMPANY_NAME,
        owner_name: str = COMPANY_OWNER,
        company_phone: str = COMPANY_PHONE,
    ) -> None:
        """
        Initialize the drafter.

        Parameters:
            company_name (str): Business name to use in drafts.
            owner_name (str): Name to sign the messages with.
            company_phone (str): Callback number to include.
        """
        self._company_name: str = company_name
        self._owner_name: str = owner_name
        self._company_phone: str = company_phone

    @property
    def company_name(self) -> str:
        """
        Get the business name used in drafts.

        Returns:
            str: The company name.
        """
        return self._company_name

    @company_name.setter
    def company_name(self, value: str) -> None:
        """
        Set the business name used in drafts.

        Parameters:
            value (str): New company name. Must not be blank.

        Raises:
            ValueError: If value is empty or only whitespace.
        """
        if not value.strip():
            raise ValueError("company_name must not be blank")
        self._company_name = value.strip()

    @property
    def owner_name(self) -> str:
        """
        Get the name the messages are signed with.

        Returns:
            str: The owner name.
        """
        return self._owner_name

    @owner_name.setter
    def owner_name(self, value: str) -> None:
        """
        Set the name the messages are signed with.

        Parameters:
            value (str): New owner name. Must not be blank.

        Raises:
            ValueError: If value is empty or only whitespace.
        """
        if not value.strip():
            raise ValueError("owner_name must not be blank")
        self._owner_name = value.strip()

    def _opener_for(self, lead: Lead) -> str:
        """
        Choose the opening sentence for a lead's project type.

        Parameters:
            lead (Lead): The lead being drafted for.

        Returns:
            str: The matching opener, or GENERIC_OPENER when the project type
                is missing or unrecognized.
        """
        return PROJECT_OPENERS.get(lead.project_type.strip().lower(), GENERIC_OPENER)

    def _visit_offer_for(self, lead: Lead) -> str:
        """
        Choose the visit offer that matches a lead's timeline.

        Parameters:
            lead (Lead): The lead being drafted for.

        Returns:
            str: The matching offer, or GENERIC_VISIT_OFFER when the timeline
                is missing or unrecognized.
        """
        return VISIT_OFFER.get(lead.timeline.strip().lower(), GENERIC_VISIT_OFFER)

    def draft_sms(self, lead: Lead) -> str:
        """
        Draft a short SMS reply for a lead.

        Kept under SMS_CHARACTER_LIMIT where possible so carriers send it as
        one message.

        Parameters:
            lead (Lead): The lead to draft for.

        Returns:
            str: The SMS body, ready to send.
        """
        return (
            f"Hi {lead.first_name}, it's {self._owner_name} at {self._company_name}. "
            f"{self._opener_for(lead)} {self._visit_offer_for(lead)} "
            f"What days work for you?"
        )

    def draft_email(self, lead: Lead) -> str:
        """
        Draft a longer email reply for a lead.

        Names the specific detail the homeowner wrote, which is what separates
        a reply that gets answered from one that reads as a form letter.

        Parameters:
            lead (Lead): The lead to draft for.

        Returns:
            str: The email body, ready to send.
        """
        detail_line = (
            f"You mentioned: \"{lead.details}\"\n\n"
            if lead.details
            else ""
        )
        location_line = f" out in {lead.city}" if lead.city else ""
        return (
            f"Hi {lead.first_name},\n\n"
            f"{self._opener_for(lead)} {self._visit_offer_for(lead)}\n\n"
            f"{detail_line}"
            f"The visit takes about thirty minutes. I measure, ask what you are "
            f"trying to end up with, and flag anything that tends to surprise "
            f"people on a job like this{location_line}. You get a written quote "
            f"after that, with the scope and the number in writing. No charge "
            f"for any of it.\n\n"
            f"If it is easier to talk it through first, call or text "
            f"{self._company_phone}.\n\n"
            f"{self._owner_name}\n"
            f"{self._company_name}"
        )

    def draft_subject(self, lead: Lead) -> str:
        """
        Draft the email subject line for a lead.

        Parameters:
            lead (Lead): The lead to draft for.

        Returns:
            str: The subject line.
        """
        return f"Your {lead.project_type.lower()} project, from {self._company_name}"

    def __str__(self) -> str:
        """
        Return a readable representation of the drafter.

        Returns:
            str: The company and owner the drafts are written as.
        """
        return f"FollowUpDrafter(company={self._company_name}, owner={self._owner_name})"


def load_leads(csv_path: Path) -> list[Lead]:
    """
    Read leads from a CSV export.

    Parameters:
        csv_path (Path): Path to the CSV file.

    Returns:
        list[Lead]: One Lead per data row, in file order.

    Raises:
        FileNotFoundError: If csv_path does not exist.
        ValueError: If the file has no header row.
    """
    if not csv_path.is_file():
        raise FileNotFoundError(f"No lead export found at {csv_path}")

    with csv_path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        if reader.fieldnames is None:
            raise ValueError(f"{csv_path} has no header row")
        return [Lead.from_row(row) for row in reader]


def render_lead(lead: Lead, drafter: FollowUpDrafter) -> str:
    """
    Render one lead and its drafts as a printable block.

    Parameters:
        lead (Lead): The lead to render.
        drafter (FollowUpDrafter): The drafter producing the messages.

    Returns:
        str: The formatted block, without a trailing newline.
    """
    sms = drafter.draft_sms(lead)
    over_limit = len(sms) > SMS_CHARACTER_LIMIT
    sms_note = (
        f"  [{len(sms)} chars, over the {SMS_CHARACTER_LIMIT} limit, trim before sending]"
        if over_limit
        else f"  [{len(sms)} chars]"
    )

    flag = "  ** REPLY TODAY **" if lead.is_urgent else ""
    contact = lead.phone + (f" / {lead.email}" if lead.email else "")

    lines = [
        "=" * 72,
        f"{lead.name}{flag}",
        f"  {lead.project_type} in {lead.city or 'unspecified'} "
        f"| timeline: {lead.timeline or 'not given'} | via {lead.source}",
        f"  submitted {lead.submitted_display} | {contact}",
        "",
        "  --- SMS ---",
        f"  {sms}",
        sms_note,
        "",
        "  --- EMAIL ---",
        f"  Subject: {drafter.draft_subject(lead)}",
        "",
    ]
    lines.extend(f"  {line}" if line else "" for line in drafter.draft_email(lead).split("\n"))
    return "\n".join(lines)


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    """
    Parse command-line arguments.

    Parameters:
        argv (list[str] | None): Argument list, or None to read sys.argv.

    Returns:
        argparse.Namespace: The parsed arguments.
    """
    parser = argparse.ArgumentParser(
        description="Draft SMS and email follow-ups for inbound remodeling leads.",
    )
    parser.add_argument(
        "--csv",
        type=Path,
        default=DEFAULT_CSV_PATH,
        help=f"Path to the lead export CSV (default: {DEFAULT_CSV_PATH.name})",
    )
    parser.add_argument(
        "--only-urgent",
        action="store_true",
        help="Draft only for leads whose timeline is ASAP or similar",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    """
    Load the leads, draft a follow-up for each, and print the results.

    Parameters:
        argv (list[str] | None): Argument list, or None to read sys.argv.

    Returns:
        int: 0 on success, 1 when the export could not be read.
    """
    args = parse_args(argv)

    try:
        leads = load_leads(args.csv)
    except (FileNotFoundError, ValueError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    if args.only_urgent:
        leads = [lead for lead in leads if lead.is_urgent]

    if not leads:
        print("No leads to draft for.")
        return 0

    drafter = FollowUpDrafter()
    urgent_count = sum(1 for lead in leads if lead.is_urgent)

    print(f"{len(leads)} lead(s) loaded from {args.csv.name}. {urgent_count} need a reply today.")
    print()
    for lead in leads:
        print(render_lead(lead, drafter))
        print()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
