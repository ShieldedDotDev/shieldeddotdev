<?php

function shield($title, $text, $color) {
	$query = http_build_query([
		'title' => $title,
		'text'  => $text,
		'color' => $color,
	]);

	return '<img src="https://img.shielded.dev/s?' . $query.'" alt="' . htmlentities($title . ' : ' . $text) . '">';
}

?>
<!doctype html>
<html>

<head>
	<?php require('_head.php') ?>
</head>

<body class="home--app">
	<?php require('_header.php') ?>
	<main>
		<section>
			<article class="callout">
				<p>Real‑time README badges driven by your own data</p>
			</article>
		</section>
		<section>
			<article class="home-core">
				<div class="welcome">
					<h3>Welcome to Shielded.dev</h3>
					<p>Shielded.dev is a service that allows you to create dynamic README badge shields for your projects.</p>
					<p>It's entirely free and open source.</p>
				</div>
				<div class="getting-started">
					<h3>Get started</h3>
					<a href="/github/login" class="github-login">Sign in with GitHub</a>
					<p>When you sign in, we’ll set two simple cookies to make things work. One helps us talk to GitHub, and the other confirms you’re signed in.</p>
					<p>That’s it — no tracking, no ads.</p>	
				</div>

				<div class="examples">
					<h3>Examples</h3>
					<ul>
						<li>
							<?= shield("Build", "passing", "28a3df") ?>
						</li>
						<li>
							<?= shield("Coverage", "100%", "28a3df") ?>
						</li>
						<li>
							<?= shield("Quality", "A+", "green") ?>
						</li>
						<li>
							<?= shield("License", "MIT", "428F7E") ?>
						</li>
						<li>
							<?= shield("Stable", "1.2.34", "28a3df") ?>
							<?= shield("Latest", "1.2.34", "28a3df") ?>
							<?= shield("Unstable", "8.67.5-dev", "e68718") ?>
						</li>
						<li>
							<?= shield("Daily Downloads", "128", "28a3df") ?>
						</li>
						<li>
							<?= shield("Issues", "5", "99004d") ?>
						</li>
						<li>
							<?= shield("Pull Requests", "1", "99004d") ?>
						</li>
						<li>
							<?= shield("Bundle Size", "1.2mb", "5c72a6") ?>
						</li>
						<li>
							<?= shield("Contributors", "13", "5c72a6") ?>
						</li>
						<li>
							<?= shield("Commits", "2/week", "28a3df") ?>
						</li>
						<li>
							<?= shield("Releases", "1/month", "28a3df") ?>
						</li>
					</ul>
				</div>
			</article>
		</section>
		<section>
			<article class="api-examples">
				<h3>API examples</h3>
				<div id="api-example"></div>
			</article>
		</section>
		<section>
			<article class="open-source">
				<h3>Open Source</h3>
				<p>Interested in reviewing the code or hosting your own instance? The complete source is available on GitHub.</p>
				<p>Visit <a href="https://github.com/shieldedDotDev/">Shielded.dev on GitHub</a> to learn more.</p>
				<p>Shielded.dev is built with Go and TypeScript using a MySQL database.</p>
			</article>
		</section>
	</main>
	<script type="module">
		import { Home } from '/main.js';

		document.addEventListener('DOMContentLoaded', function () {
			Home(document.getElementById('api-example'));
		});
	</script>
	<?php require('_footer.php') ?>
</body>

</html>
