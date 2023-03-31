import { FormEvent, useState } from 'react';

function App() {
	const [inputValue, setInputValue] = useState('');
	const [finalText, setFinalText] = useState('');
	const [loading, setLoading] = useState(false);

	// Analyze possible improvements to prompt
	const prompt = `Observe se na seguinte sentença existe palavrões, até mesmo os abreviados em português. '${inputValue}'. Se sim, troque todos os palavrões por asteriscos. Senão, retorne a sentença da forma que foi escrita`;

	const handleFetchGptData = (e: FormEvent) => {
		e.preventDefault();

		if (inputValue.trim() === '') {
			return;
		}

		setLoading(true);

		fetch('https://api.openai.com/v1/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${import.meta.env.VITE_CHAT_GPT_API_KEY}`,
			},
			body: JSON.stringify({
				prompt,
				model: 'text-davinci-003',
				temperature: 0,
				top_p: 0,
				max_tokens: 2048,
			}),
		})
			.then(response => response.json())
			.then(data => {
				const textWithoutBadWords = data.choices[0].text
					.replaceAll('\n', '')
					.replaceAll('.', '');

				setFinalText(textWithoutBadWords);
			})
			.catch(() => window.alert('Erro'))
			.finally(() => setLoading(false));
	};

	return (
		<main className="bg-gray-950 text-gray-50 flex flex-col justify-center items-center w-screen h-screen">
			<div className="flex flex-col justify-center items-center gap-4 w-full max-w-md">
				<h1 className="mb-12 text-3xl">Filtro de palavrões</h1>

				<form
					className="flex flex-col justify-center items-center gap-4 w-full h-full"
					onSubmit={handleFetchGptData}
				>
					<textarea
						className="w-full p-2 border bg-gray-700 rounded text-gray-50 caret-teal-700"
						placeholder="Digite aqui seu texto com palavrões"
						name="profanity"
						id="profanity"
						value={inputValue}
						onChange={e => setInputValue(e.target.value)}
					/>

					<button
						className="border px-4 py-2 w-full rounded transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-transparent disabled:opacity-30"
						type="submit"
						disabled={inputValue.trim() === ''}
					>
						Enviar
					</button>
				</form>

				<span className="mt-20">
					Texto final: {loading ? 'carregando...' : finalText}
				</span>
			</div>
		</main>
	);
}

export default App;
