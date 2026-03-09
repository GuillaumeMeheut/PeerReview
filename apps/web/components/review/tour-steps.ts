import type { OnbordaProps } from "onborda";

export const reviewTourSteps: OnbordaProps["steps"] = [
    {
        tour: "review-tour",
        steps: [
            {
                icon: null,
                title: "Exercise Context",
                content: "This section gives you the context of the pull request — the title, author, branches, difficulty, tech stack, and file changes. Read it carefully before starting your review.",
                selector: "#tour-context",
                side: "bottom",
                showControls: true,
                pointerPadding: 8,
                pointerRadius: 8,
            },
            {
                icon: null,
                title: "Submit Your Review",
                content: "Once you've added inline comments on the code, click here to submit your review. You need at least one comment to submit.",
                selector: "#tour-submit",
                side: "right",
                showControls: true,
                pointerPadding: 8,
                pointerRadius: 8,
            },
            {
                icon: null,
                title: "AI Feedback",
                content: "After submitting your review, get detailed AI-powered feedback on your comments. It highlights what you caught and what you might have missed.",
                selector: "#tour-feedback-tab",
                side: "bottom",
                showControls: true,
                pointerPadding: 4,
                pointerRadius: 4,
            },
            {
                icon: null,
                title: "Discussions Tab",
                content: "Check out community discussions about this exercise. Ask questions, share insights, or help others.",
                selector: "#tour-discussions-tab",
                side: "bottom",
                showControls: true,
                pointerPadding: 4,
                pointerRadius: 4,
            },
            {
                icon: null,
                title: "Solutions Tab",
                content: "Explore solutions shared by other reviewers to learn different perspectives.",
                selector: "#tour-solutions-tab",
                side: "bottom",
                showControls: true,
                pointerPadding: 4,
                pointerRadius: 4,
            },
        ],
    },
];
