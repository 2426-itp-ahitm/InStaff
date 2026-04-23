import Foundation

enum AssignmentStatus: String, Codable {
    case pending = "PENDING"
    case confirmed = "CONFIRMED"
    case declined = "DECLINED"
    case requested = "REQUESTED"
    case requestConfirmed = "REQUEST_CONFIRMED"
    case requestDeclined = "REQUEST_DECLINED"

    static func normalized(_ status: AssignmentStatus?) -> AssignmentStatus {
        status ?? .pending
    }

    var isOpen: Bool {
        self == .pending || self == .requested
    }

    var isAccepted: Bool {
        self == .confirmed || self == .requestConfirmed
    }

    var isDeclined: Bool {
        self == .declined || self == .requestDeclined
    }

    var displayLabel: String {
        switch self {
        case .pending:
            return "Ausstehend"
        case .confirmed:
            return "Angenommen"
        case .declined:
            return "Abgelehnt"
        case .requested:
            return "Angefragt"
        case .requestConfirmed:
            return "Anfrage bestaetigt"
        case .requestDeclined:
            return "Anfrage abgelehnt"
        }
    }

    var rowLabel: String {
        switch self {
        case .pending:
            return "Offen"
        case .confirmed:
            return "Angenommen"
        case .declined:
            return "Abgelehnt"
        case .requested:
            return "Angefragt"
        case .requestConfirmed:
            return "Anfrage bestaetigt"
        case .requestDeclined:
            return "Anfrage abgelehnt"
        }
    }
}
