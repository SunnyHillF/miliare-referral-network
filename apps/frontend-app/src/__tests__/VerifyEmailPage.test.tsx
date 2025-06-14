import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import * as Auth from "aws-amplify/auth";

vi.mock("aws-amplify/auth", () => ({
  confirmSignUp: vi.fn(),
  resendSignUpCode: vi.fn(),
}));

const loginMock = vi.fn();
vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({ login: loginMock }),
}));

vi.mock("aws-amplify/data", () => ({
  generateClient: vi.fn(() => ({ models: { User: { create: vi.fn() } } })),
}));

const navigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = (await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  )) as typeof import("react-router-dom");
  return { ...actual, useNavigate: () => navigate };
});

function renderPage(state?: { email?: string }) {
  const initialEntries = [{ pathname: "/verify", state }];
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <VerifyEmailPage />
    </MemoryRouter>,
  );
}

describe("VerifyEmailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("prefills email from navigation state", () => {
    renderPage({ email: "user@example.com" });
    expect(screen.getByLabelText(/email/i)).toHaveValue("user@example.com");
  });

  it("shows validation errors when form is empty", async () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /verify/i }));
    expect(
      await screen.findByText(/please enter a valid email/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/verification code is required/i),
    ).toBeInTheDocument();
  });

  it("submits verification code and logs in", async () => {
    const confirmMock = Auth.confirmSignUp as unknown as jest.Mock;
    confirmMock.mockResolvedValue(undefined);

    renderPage();
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/verification code/i), {
      target: { value: "111111" },
    });
    sessionStorage.setItem("tempPassword", "Temp1234!");
    fireEvent.click(screen.getByRole("button", { name: /verify/i }));

    await waitFor(() =>
      expect(confirmMock).toHaveBeenCalledWith({
        username: "user@example.com",
        confirmationCode: "111111",
      }),
    );

    await waitFor(() =>
      expect(loginMock).toHaveBeenCalledWith("user@example.com", "Temp1234!"),
    );
  });
});
