import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import * as Auth from "aws-amplify/auth";

vi.mock("aws-amplify/auth", () => ({
  resetPassword: vi.fn(),
  confirmResetPassword: vi.fn(),
}));

function renderPage() {
  return render(
    <BrowserRouter>
      <ForgotPasswordPage />
    </BrowserRouter>,
  );
}

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows validation error when email is empty", async () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /send code/i }));
    expect(
      await screen.findByText(/please enter a valid email address/i),
    ).toBeInTheDocument();
  });

  it("submits reset code and new password", async () => {
    const resetMock = Auth.resetPassword as unknown as jest.Mock;
    const confirmMock = Auth.confirmResetPassword as unknown as jest.Mock;
    resetMock.mockResolvedValue(undefined);
    confirmMock.mockResolvedValue(undefined);

    renderPage();
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send code/i }));

    await waitFor(() =>
      expect(resetMock).toHaveBeenCalledWith({ username: "user@example.com" }),
    );
    expect(screen.getByLabelText(/verification code/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/verification code/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: "Password1!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() =>
      expect(confirmMock).toHaveBeenCalledWith({
        username: "user@example.com",
        confirmationCode: "123456",
        newPassword: "Password1!",
      }),
    );
  });
});
